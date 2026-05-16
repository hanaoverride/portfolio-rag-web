import logging

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Bookmark

logger = logging.getLogger(__name__)


async def create_bookmark(
    session: AsyncSession, user_id: int, content_id: str
) -> Bookmark:
    bookmark = Bookmark(user_id=user_id, content_id=content_id)
    session.add(bookmark)
    await session.flush()
    await session.refresh(bookmark)
    return bookmark


async def get_user_bookmarks(
    session: AsyncSession, user_id: int, offset: int = 0, limit: int = 20
) -> tuple[list[Bookmark], int]:
    # Get total count
    count_result = await session.execute(
        select(func.count()).select_from(Bookmark).where(Bookmark.user_id == user_id)
    )
    total = count_result.scalar() or 0

    # Get items
    result = await session.execute(
        select(Bookmark)
        .options(selectinload(Bookmark.content))
        .where(Bookmark.user_id == user_id)
        .order_by(Bookmark.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    return list(result.scalars().all()), total


async def get_user_bookmark(
    session: AsyncSession, user_id: int, content_id: str
) -> Bookmark | None:
    result = await session.execute(
        select(Bookmark).where(
            Bookmark.user_id == user_id, Bookmark.content_id == content_id
        )
    )
    return result.scalar_one_or_none()


async def delete_bookmark(session: AsyncSession, user_id: int, content_id: str) -> bool:
    stmt = select(Bookmark).where(
        Bookmark.user_id == user_id, Bookmark.content_id == content_id
    )
    result = await session.execute(stmt)
    bookmark = result.scalar_one_or_none()

    if not bookmark:
        logger.warning(
            f"Bookmark for content {content_id} not found for user {user_id}"
        )
        return False

    await session.delete(bookmark)
    await session.flush()
    logger.info(
        f"Bookmark for content {content_id} successfully deleted for user {user_id}"
    )
    return True
