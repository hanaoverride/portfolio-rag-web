from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Bookmark, Comment, Content, YouTuber


async def get_site_statistics(session: AsyncSession) -> dict[str, int]:
    # Get total bookmarks count
    bookmarks_count_result = await session.execute(
        select(func.count()).select_from(Bookmark)
    )
    bookmarks_total = bookmarks_count_result.scalar() or 0

    # Get total comments count
    comments_count_result = await session.execute(
        select(func.count()).select_from(Comment)
    )
    comments_total = comments_count_result.scalar() or 0

    # Get total contents count
    contents_count_result = await session.execute(
        select(func.count()).select_from(Content)
    )
    contents_total = contents_count_result.scalar() or 0

    # Get total views count
    views_sum_result = await session.execute(select(func.sum(Content.views)))
    views_total = views_sum_result.scalar() or 0

    # Get total youtubers count
    youtubers_count_result = await session.execute(
        select(func.count()).select_from(YouTuber)
    )
    youtubers_total = youtubers_count_result.scalar() or 0

    return {
        "total_bookmarks": bookmarks_total,
        "total_comments": comments_total,
        "total_contents": contents_total,
        "total_views": int(views_total),
        "total_youtubers": youtubers_total,
    }


async def get_user_statistics(session: AsyncSession, user_id: int) -> dict[str, int]:
    # Get user bookmarks count
    bookmarks_count_result = await session.execute(
        select(func.count()).select_from(Bookmark).where(Bookmark.user_id == user_id)
    )
    bookmarks_total = bookmarks_count_result.scalar() or 0

    # Get user comments count
    comments_count_result = await session.execute(
        select(func.count()).select_from(Comment).where(Comment.user_id == user_id)
    )
    comments_total = comments_count_result.scalar() or 0

    return {
        "total_bookmarks": bookmarks_total,
        "total_comments": comments_total,
        "total_contents": 0,
        "total_views": 0,
        "total_youtubers": 0,
    }
