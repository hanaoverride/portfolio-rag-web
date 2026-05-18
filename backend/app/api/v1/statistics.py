from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ...data.database import get_db
from ...data.models import User
from ...data.schemas import StatisticsResponse
from ...data.statistics_repository import get_site_statistics, get_user_statistics
from ..dependencies import get_current_user

router = APIRouter(prefix="/statistics", tags=["statistics"])


@router.get("", response_model=StatisticsResponse)
async def get_statistics(session: AsyncSession = Depends(get_db)):
    """Get site-wide statistics."""
    stats = await get_site_statistics(session)
    return stats


@router.get("/me", response_model=StatisticsResponse)
async def get_my_statistics(
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get statistics for the current user."""
    stats = await get_user_statistics(session, current_user.id)
    return stats
