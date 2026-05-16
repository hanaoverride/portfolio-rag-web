"""Notice API router."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ...data.database import get_db
from ...data.models import Notice, User
from ...data.schemas import (
    CreateNoticeRequest,
    NoticeResponse,
    PaginatedNoticesResponse,
)
from ..dependencies import get_current_admin

router = APIRouter()


@router.get("/", response_model=PaginatedNoticesResponse)
async def list_notices(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List notices with pagination."""
    query = select(Notice).order_by(
        Notice.is_important.desc(), Notice.created_at.desc()
    )

    # Get total count
    count_query = select(func.count()).select_from(Notice)
    total = await db.scalar(count_query) or 0

    # Get items
    result = await db.execute(query.offset(offset).limit(limit))
    items = result.scalars().all()

    # Convert to response objects
    notice_list = []
    for item in items:
        # Load author for author_name
        author_result = await db.execute(select(User).where(User.id == item.author_id))
        author = author_result.scalar_one_or_none()
        author_name = author.display_name if author else "Unknown"

        notice_list.append(
            NoticeResponse(
                id=item.id,
                title=item.title,
                content=item.content,
                is_important=item.is_important,
                created_at=item.created_at,
                updated_at=item.updated_at,
                author_name=author_name,
            )
        )

    return PaginatedNoticesResponse(
        items=notice_list,
        total=total,
        limit=limit,
        offset=offset,
    )


@router.post("/", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
async def create_notice(
    request: CreateNoticeRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new notice (Admin only)."""
    new_notice = Notice(
        title=request.title,
        content=request.content,
        is_important=request.is_important,
        author_id=admin.id,
    )

    db.add(new_notice)
    await db.commit()
    await db.refresh(new_notice)

    return NoticeResponse(
        id=new_notice.id,
        title=new_notice.title,
        content=new_notice.content,
        is_important=new_notice.is_important,
        created_at=new_notice.created_at,
        updated_at=new_notice.updated_at,
        author_name=admin.display_name,
    )


@router.get("/{notice_id}", response_model=NoticeResponse)
async def get_notice(
    notice_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific notice."""
    result = await db.execute(select(Notice).where(Notice.id == notice_id))
    notice = result.scalar_one_or_none()

    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found",
        )

    author_result = await db.execute(select(User).where(User.id == notice.author_id))
    author = author_result.scalar_one_or_none()
    author_name = author.display_name if author else "Unknown"

    return NoticeResponse(
        id=notice.id,
        title=notice.title,
        content=notice.content,
        is_important=notice.is_important,
        created_at=notice.created_at,
        updated_at=notice.updated_at,
        author_name=author_name,
    )
