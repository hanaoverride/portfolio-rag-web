"""Categories API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.repository import get_categories, get_contents
from app.data.schemas import CategoryResponse, ContentListResponse, ContentResponse, Author, TableOfContentsItem
from app.data.database import get_db

router = APIRouter(prefix="/categories", tags=["categories"])


def _content_to_response(content) -> ContentResponse:
    """Convert Content model to ContentResponse schema."""
    return ContentResponse(
        id=content.id,
        title=content.title,
        description=content.description,
        thumbnail=content.thumbnail,
        video_url=content.video_url,
        category=content.category,
        author=Author(name=content.author_name, avatar=content.author_avatar),
        duration=content.duration,
        views=content.views,
        created_at=content.created_at,
        table_of_contents=[
            TableOfContentsItem(**item) for item in (content.table_of_contents or [])
        ],
        body_content=content.body_content,
        related_contents=content.related_contents or [],
        is_new=content.is_new,
    )


@router.get("", response_model=list[CategoryResponse])
async def list_categories(session: AsyncSession = Depends(get_db)):
    """List all categories."""
    try:
        categories = await get_categories(session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")
    return [CategoryResponse(id=c.id, name=c.name, slug=c.slug) for c in categories]


@router.get("/{slug}", response_model=CategoryResponse)
async def get_category(slug: str, session: AsyncSession = Depends(get_db)):
    """Get a single category by slug."""
    categories = await get_categories(session)
    for c in categories:
        if c.slug == slug:
            return CategoryResponse(id=c.id, name=c.name, slug=c.slug)
    raise HTTPException(status_code=404, detail="Category not found")


@router.get("/{slug}/contents", response_model=ContentListResponse)
async def get_category_contents(
    slug: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    """Get contents belonging to a category."""
    categories = await get_categories(session)
    category = None
    for c in categories:
        if c.slug == slug:
            category = c
            break
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    try:
        all_contents = await get_contents(session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch contents: {str(e)}")

    filtered = [c for c in all_contents if slug.lower() in [cat.lower() for cat in c.category]]
    total = len(filtered)
    paginated = filtered[offset : offset + limit]

    return ContentListResponse(
        items=[_content_to_response(c) for c in paginated],
        total=total,
        limit=limit,
        offset=offset,
    )
