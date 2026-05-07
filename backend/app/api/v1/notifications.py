import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from ...data.database import get_db
from ...data.models import Notification, User
from ...data.schemas import CreateNotificationRequest, NotificationResponse
from ..dependencies import get_current_admin, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    request: CreateNotificationRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Create a new notification. Restricted to administrators.
    """
    logger.info(f"Creating notification: {request.title} for user_id: {request.user_id}")
    try:
        notification = Notification(
            title=request.title,
            message=request.message,
            user_id=request.user_id,
            is_read=False
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
            detail=f"Notification creation failed: {str(e)}"
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
    # Get user specific notifications + global notifications (user_id is None)
    query = select(Notification).where(
        (Notification.user_id == current_user.id) | (Notification.user_id.is_(None))
    ).order_by(Notification.created_at.desc())
    
    result = await db.execute(query)
    notifications = result.scalars().all()
    logger.info(f"Found {len(notifications)} notifications")
    return notifications


@router.delete("/{notification_id}", status_code=status.HTTP_200_OK)
async def delete_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a specific notification.
    """
    logger.info(f"Delete request received for ID: {notification_id} from user: {current_user.email}")
    
    query = select(Notification).where(
        Notification.id == notification_id
    )
    result = await db.execute(query)
    notification = result.scalar_one_or_none()
    
    if not notification:
        logger.warning(f"Notification {notification_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check permissions
    if notification.user_id is not None and notification.user_id != current_user.id and not current_user.is_admin:
        logger.warning(f"Permission denied for user {current_user.email} to delete notification {notification_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this notification"
        )
    
    try:
        await db.delete(notification)
        await db.commit()
        logger.info(f"Notification {notification_id} deleted successfully")
    except Exception as e:
        logger.error(f"Failed to delete notification {notification_id}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deletion failed: {str(e)}"
        )
    return {"status": "success", "message": "Notification deleted"}


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
    Delete all notifications for the current user.
    """
    logger.info(f"Delete all request received from user: {current_user.email}")
    try:
        query = delete(Notification).where(
            Notification.user_id == current_user.id
        )
        result = await db.execute(query)
        await db.commit()
        logger.info(f"Deleted {result.rowcount} notifications for user {current_user.email}")
        return {"status": "success", "deleted_count": result.rowcount}
    except Exception as e:
        logger.error(f"Failed to delete all notifications for user {current_user.email}: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bulk deletion failed: {str(e)}"
        )


@router.post("/delete-all", status_code=status.HTTP_200_OK)
async def delete_all_notifications_post(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete all notifications for the current user via POST (fallback).
    """
    return await delete_all_notifications(db, current_user)
