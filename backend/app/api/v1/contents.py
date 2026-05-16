"""Contents API routes."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.database import get_db
from app.data.repository import get_content_by_id, get_contents
from app.data.schemas import (
    Author,
    ContentListResponse,
    ContentResponse,
    TableOfContentsItem,
)

router = APIRouter(prefix="/contents", tags=["contents"])


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


@router.get("", response_model=ContentListResponse)
async def list_contents(
    category: Optional[str] = Query(None, description="Filter by category name"),
    search: Optional[str] = Query(None, description="Search in title/description"),
    is_new: Optional[bool] = Query(None, description="Filter by is_new flag"),
    sort_by: Optional[str] = Query(
        None, description="Sort by field (views, created_at)"
    ),
    order: str = Query("desc", description="Sort order (asc, desc)"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Pagination limit"),
    session: AsyncSession = Depends(get_db),
):
    """List contents with optional filters and pagination."""
    try:
        contents = await get_contents(session)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch contents: {str(e)}"
        )

    # Apply filters
    if category:
        contents = [
            c
            for c in contents
            if category.lower() in [cat.lower() for cat in c.category]
        ]
    if is_new is not None:
        contents = [c for c in contents if c.is_new is is_new]
    if search:
        search_lower = search.lower()
        contents = [
            c
            for c in contents
            if search_lower in c.title.lower() or search_lower in c.description.lower()
        ]

    # Apply sorting
    if not sort_by:
        sort_by = "views"

    reverse = order.lower() == "desc"
    if sort_by == "views":
        # Sort by views desc, then created_at desc
        contents.sort(key=lambda x: (x.views, x.created_at), reverse=reverse)
    elif sort_by == "created_at":
        contents.sort(key=lambda x: x.created_at, reverse=reverse)

    total = len(contents)
    paginated = contents[offset : offset + limit]

    return ContentListResponse(
        items=[_content_to_response(c) for c in paginated],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{content_id}", response_model=ContentResponse)
async def get_content(content_id: str, session: AsyncSession = Depends(get_db)):
    """Get a single content by ID."""
    content = await get_content_by_id(session, content_id)
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return _content_to_response(content)


@router.post("/{content_id}/view")
async def increment_views(content_id: str, session: AsyncSession = Depends(get_db)):
    """Increment the view count for a content."""
    from app.data.repository import increment_content_views
    success = await increment_content_views(session, content_id)
    if not success:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"status": "success"}


@router.get("/{content_id}/related", response_model=ContentListResponse)
async def get_related_contents(
    content_id: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    """Get related contents for a given content."""
    content = await get_content_by_id(session, content_id)
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")

    related_ids = content.related_contents or []
    try:
        all_contents = await get_contents(session)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch contents: {str(e)}"
        )

    related = [c for c in all_contents if c.id in related_ids]
    total = len(related)
    paginated = related[offset : offset + limit]

    return ContentListResponse(
        items=[_content_to_response(c) for c in paginated],
        total=total,
        limit=limit,
        offset=offset,
    )
