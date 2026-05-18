import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from ...data.database import get_db
from ...data.models import Notification, User, UserNotificationState
from ...data.schemas import CreateNotificationRequest, NotificationResponse
from ..dependencies import get_current_admin, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post(
    "", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED
)
async def create_notification(
    request: CreateNotificationRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Create a new notification. Restricted to administrators.
    """
    logger.info(
        f"Creating notification: {request.title} for user_id: {request.user_id}"
    )
    try:
        notification = Notification(
            title=request.title,
            message=request.message,
            user_id=request.user_id,
            is_read=False,
        )
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        logger.info(f"Notification created with ID: {notification.id}")
        return notification
    except Exception as e:
        logger.error(f"Failed to create notification: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Notification creation failed: {str(e)}",
        )


@router.get("", response_model=list[NotificationResponse])
async def get_my_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get notifications for the current user.
    """
    logger.info(f"Fetching notifications for user: {current_user.email}")

    # Select notifications joined with user-specific state
    # We want notifications where:
    # 1. (notification.user_id == current_user.id OR notification.user_id IS NULL)
    # 2. AND (state.is_deleted IS NULL OR state.is_deleted IS FALSE)

    stmt = (
        select(
            Notification.id,
            Notification.title,
            Notification.message,
            # Prefer state.is_read, fallback to notification.is_read
            UserNotificationState.is_read.label("state_is_read"),
            Notification.is_read.label("base_is_read"),
            Notification.created_at,
            Notification.user_id,
        )
        .outerjoin(
            UserNotificationState,
            and_(
                UserNotificationState.notification_id == Notification.id,
                UserNotificationState.user_id == current_user.id,
            ),
        )
        .where(
            and_(
                (Notification.user_id == current_user.id)
                | (Notification.user_id.is_(None)),
                (UserNotificationState.is_deleted.is_not(True)),
            )
        )
        .order_by(Notification.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    notifications = []
    for row in rows:
        notifications.append(
            {
                "id": row.id,
                "title": row.title,
                "message": row.message,
                "is_read": row.state_is_read
                if row.state_is_read is not None
                else row.base_is_read,
                "created_at": row.created_at,
                "user_id": row.user_id,
            }
        )

    logger.info(f"Found {len(notifications)} notifications")
    return notifications


@router.delete("/{notification_id}", status_code=status.HTTP_200_OK)
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete (dismiss) a specific notification for the current user.
    """
    logger.info(
        f"Dismiss request received for ID: {notification_id} from user: {current_user.email}"
    )

    # Check if notification exists and user has access
    query = select(Notification).where(
        and_(
            Notification.id == notification_id,
            (Notification.user_id == current_user.id)
            | (Notification.user_id.is_(None)),
        )
    )
    result = await db.execute(query)
    notification = result.scalar_one_or_none()

    if not notification:
        logger.warning(f"Notification {notification_id} not found or access denied")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="알림을 찾을 수 없습니다."
        )

    try:
        # Instead of deleting the record, we insert/update the state table
        stmt = (
            insert(UserNotificationState)
            .values(
                user_id=current_user.id,
                notification_id=notification_id,
                is_deleted=True,
                updated_at=func.now(),
            )
            .on_conflict_do_update(
                constraint="uq_user_notification_state",
                set_={"is_deleted": True, "updated_at": func.now()},
            )
        )

        await db.execute(stmt)
        await db.commit()
        logger.info(
            f"Notification {notification_id} dismissed for user {current_user.email}"
        )
    except Exception as e:
        logger.error(f"Failed to dismiss notification {notification_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"알림 삭제에 실패했습니다: {str(e)}",
        )
    return {"status": "success", "message": "Notification dismissed"}


@router.post("/{notification_id}/delete", status_code=status.HTTP_200_OK)
async def delete_notification_post(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a specific notification via POST (fallback).
    """
    return await delete_notification(notification_id, db, current_user)


@router.delete("", status_code=status.HTTP_200_OK)
async def delete_all_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete all notifications for the current user (dismiss them).
    """
    logger.info(f"Delete all request received from user: {current_user.email}")
    try:
        # Get all notifications that the user can see
        stmt = select(Notification.id).where(
            (Notification.user_id == current_user.id) | (Notification.user_id.is_(None))
        )
        result = await db.execute(stmt)
        notification_ids = [row[0] for row in result.all()]

        if not notification_ids:
            return {"status": "success", "deleted_count": 0}

        # Bulk upsert into UserNotificationState
        for nid in notification_ids:
            upsert_stmt = (
                insert(UserNotificationState)
                .values(
                    user_id=current_user.id,
                    notification_id=nid,
                    is_deleted=True,
                    updated_at=func.now(),
                )
                .on_conflict_do_update(
                    constraint="uq_user_notification_state",
                    set_={"is_deleted": True, "updated_at": func.now()},
                )
            )
            await db.execute(upsert_stmt)

        await db.commit()
        logger.info(
            f"Dismissed {len(notification_ids)} notifications for user {current_user.email}"
        )
        return {"status": "success", "deleted_count": len(notification_ids)}
    except Exception as e:
        logger.error(
            f"Failed to delete all notifications for user {current_user.email}: {e}"
        )
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bulk deletion failed: {str(e)}",
        )


@router.post("/{notification_id}/read", status_code=status.HTTP_200_OK)
async def mark_notification_as_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark a notification as read for the current user.
    """
    query = select(Notification).where(
        and_(
            Notification.id == notification_id,
            (Notification.user_id == current_user.id)
            | (Notification.user_id.is_(None)),
        )
    )
    result = await db.execute(query)
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(status_code=404, detail="알림을 찾을 수 없습니다.")

    try:
        stmt = (
            insert(UserNotificationState)
            .values(
                user_id=current_user.id,
                notification_id=notification_id,
                is_read=True,
                updated_at=func.now(),
            )
            .on_conflict_do_update(
                constraint="uq_user_notification_state",
                set_={"is_read": True, "updated_at": func.now()},
            )
        )

        await db.execute(stmt)
        await db.commit()
        return {"status": "success", "message": "Notification marked as read"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/delete-all", status_code=status.HTTP_200_OK)
async def delete_all_notifications_post(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete all notifications for the current user via POST (fallback).
    """
    return await delete_all_notifications(db, current_user)
