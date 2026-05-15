"""Health check API routes."""

from __future__ import annotations

from fastapi import APIRouter

from app.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    """Status check endpoint."""
    return {"status": "ok", "service": settings.service_name}
