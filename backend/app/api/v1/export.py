"""Export API routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.data.database import get_db
from app.data.models import Bookmark, Comment, User

router = APIRouter(prefix="/export", tags=["export"])


@router.get("")
async def export_all_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Export all user data (bookmarks, comments, profile)."""
    bookmarks_result = await db.execute(
        select(Bookmark).where(Bookmark.user_id == current_user.id)
    )
    bookmarks = list(bookmarks_result.scalars().all())

    comments_result = await db.execute(
        select(Comment).where(Comment.user_id == current_user.id)
    )
    comments = list(comments_result.scalars().all())

    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "display_name": current_user.display_name,
            "created_at": current_user.created_at.isoformat(),
        },
        "bookmarks": [
            {
                "content_id": bm.content_id,
                "created_at": bm.created_at.isoformat(),
            }
            for bm in bookmarks
        ],
        "comments": [
            {
                "id": c.id,
                "content_id": c.content_id,
                "text": c.text,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat(),
            }
            for c in comments
        ],
    }
