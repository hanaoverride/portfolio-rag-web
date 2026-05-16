"""YouTubers API routes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.database import get_db
from app.data.repository import get_youtubers
from app.data.schemas import PaginatedYouTubersResponse, YouTuberResponse

router = APIRouter(prefix="/youtubers", tags=["youtubers"])


def _youtuber_to_response(youtuber) -> YouTuberResponse:
    """Convert YouTuber model to YouTuberResponse schema."""
    return YouTuberResponse(
        id=youtuber.id,
        name=youtuber.name,
        avatar=youtuber.avatar,
        channel_url=youtuber.channel_url,
        subscribers=youtuber.subscribers,
        description=youtuber.description,
        categories=youtuber.categories or [],
        content_count=youtuber.content_count,
    )


@router.get("", response_model=PaginatedYouTubersResponse)
async def list_youtubers(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_db),
):
    """List all youtubers with pagination."""
    try:
        youtubers = await get_youtubers(session)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch youtubers: {str(e)}"
        )

    total = len(youtubers)
    paginated = youtubers[offset : offset + limit]

    return PaginatedYouTubersResponse(
        items=[_youtuber_to_response(y) for y in paginated],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get("/{youtuber_id}", response_model=YouTuberResponse)
async def get_youtuber(youtuber_id: str, session: AsyncSession = Depends(get_db)):
    """Get a single youtuber by ID."""
    youtubers = await get_youtubers(session)
    for y in youtubers:
        if y.id == youtuber_id:
            return _youtuber_to_response(y)
    raise HTTPException(status_code=404, detail="YouTuber not found")
