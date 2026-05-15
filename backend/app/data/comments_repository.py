"""Repository for comments."""

from __future__ import annotations

import logging
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Comment

logger = logging.getLogger(__name__)


async def create_comment(
    session: AsyncSession, content_id: str, user_id: int, text: str
) -> Comment:
    """Create a comment on content."""
    comment = Comment(content_id=content_id, user_id=user_id, text=text)
    session.add(comment)
    await session.flush()
    await session.refresh(comment)
    return comment


async def get_content_comments(
    session: AsyncSession, content_id: str, offset: int = 0, limit: int = 20
) -> tuple[list[Comment], int]:
    """Get comments for a content with pagination."""
    # Get total count
    from sqlalchemy import func

    count_result = await session.execute(
        select(func.count()).where(Comment.content_id == content_id)
    )
    total = count_result.scalar_one()

    # Get paginated items
    result = await session.execute(
        select(Comment)
        .options(selectinload(Comment.user))
        .where(Comment.content_id == content_id)
        .order_by(Comment.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    return list(result.scalars().all()), total


async def delete_comment(session: AsyncSession, comment_id: int, user_id: int) -> bool:
    """Delete a comment. Only the owner can delete their comment."""
    # Use select instead of get for complex where clause
    result = await session.execute(
        select(Comment).where(Comment.id == comment_id, Comment.user_id == user_id)
    )
    comment = result.scalar_one_or_none()
    if not comment:
        logger.warning(
            f"Comment {comment_id} not found or not authorized for user {user_id}"
        )
        return False

    await session.delete(comment)
    await session.flush()
    logger.info(f"Comment {comment_id} successfully marked for deletion")
    return True


async def update_comment(
    session: AsyncSession, comment_id: int, user_id: int, text: str
) -> Comment | None:
    """Update a comment. Only the owner can update their comment."""
    result = await session.execute(
        select(Comment).where(Comment.id == comment_id, Comment.user_id == user_id)
    )
    comment = result.scalar_one_or_none()
    if not comment:
        return None

    comment.text = text
    await session.flush()
    await session.refresh(comment)
    return comment
