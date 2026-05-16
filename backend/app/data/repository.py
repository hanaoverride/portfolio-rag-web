from cachetools import TTLCache
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Category, Content, YouTuber

_cache: TTLCache = TTLCache(maxsize=1, ttl=300)


async def get_contents(session: AsyncSession) -> list[Content]:
    if "contents" in _cache:
        return list(_cache["contents"])
    result = await session.execute(
        select(Content).order_by(Content.views.desc(), Content.created_at.desc())
    )
    contents = list(result.scalars().all())
    _cache["contents"] = contents
    return list(contents)


async def get_content_by_id(session: AsyncSession, content_id: str) -> Content | None:
    result = await session.execute(select(Content).where(Content.id == content_id))
    return result.scalar_one_or_none()


async def increment_content_views(session: AsyncSession, content_id: str) -> bool:
    content = await get_content_by_id(session, content_id)
    if content:
        content.views += 1
        await session.commit()
        # Clear cache since data changed
        if "contents" in _cache:
            del _cache["contents"]
        return True
    return False


async def get_categories(session: AsyncSession) -> list[Category]:
    if "categories" in _cache:
        return _cache["categories"]
    result = await session.execute(select(Category))
    categories = list(result.scalars().all())
    _cache["categories"] = categories
    return categories


async def get_youtubers(session: AsyncSession) -> list[YouTuber]:
    if "youtubers" in _cache:
        return _cache["youtubers"]
    result = await session.execute(select(YouTuber))
    youtubers = list(result.scalars().all())
    _cache["youtubers"] = youtubers
    return youtubers
