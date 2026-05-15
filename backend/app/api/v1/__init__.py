"""API v1 routes."""

from fastapi import APIRouter

from .auth import router as auth_router
from .bookmarks import router as bookmarks_router
from .categories import router as categories_router
from .chat import router as chat_router
from .comments import router as comments_router
from .contents import router as contents_router
from .export import router as export_router
from .health import router as health_router
from .notices import router as notices_router
from .notifications import router as notifications_router
from .youtubers import router as youtubers_router
from .admin import router as admin_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(bookmarks_router)
router.include_router(categories_router)
router.include_router(chat_router)
router.include_router(comments_router)
router.include_router(contents_router)
router.include_router(export_router)
router.include_router(health_router)
router.include_router(youtubers_router)
router.include_router(notices_router, prefix="/notices", tags=["notices"])
router.include_router(notifications_router)
router.include_router(admin_router)
