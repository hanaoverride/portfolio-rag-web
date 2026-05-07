import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


from app.data.bookmarks_repository import create_bookmark, delete_bookmark, get_user_bookmarks, get_user_bookmark
from app.data.database import get_db
from app.data.models import User
from app.data.schemas import Author, BookmarkResponse, ContentResponse, PaginatedBookmarksResponse, CreateBookmarkRequest
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("", response_model=PaginatedBookmarksResponse)
async def list_bookmarks(
    offset: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PaginatedBookmarksResponse:
    """List current user's bookmarks."""
    bookmarks, total = await get_user_bookmarks(db, current_user.id, offset, limit)

    items = []
    for bm in bookmarks:
        content = bm.content
        if not content:
            continue
            
        items.append(
            BookmarkResponse(
                content=ContentResponse.model_validate(content),
                bookmarked_at=bm.created_at,
            )
        )

    return PaginatedBookmarksResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/{content_id}", status_code=status.HTTP_200_OK)
async def check_bookmark_route(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Check if the given content is bookmarked by the user."""
    bookmark = await get_user_bookmark(db, current_user.id, content_id)
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found",
        )
    return {"content_id": bookmark.content_id, "bookmarked_at": bookmark.created_at}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_bookmark_route(
    request: CreateBookmarkRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a bookmark for the given content."""
    try:
        bookmark = await create_bookmark(db, current_user.id, request.content_id)
        return {
            "message": "Bookmark created successfully",
            "content_id": bookmark.content_id,
            "bookmarked_at": bookmark.created_at,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create bookmark: {str(e)}",
        )


@router.delete("/{content_id}", status_code=status.HTTP_200_OK)
async def delete_bookmark_route(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a bookmark by content ID."""
    logger.info(f"Delete request for bookmark content {content_id} by user {current_user.id}")
    try:
        deleted = await delete_bookmark(db, current_user.id, content_id)
        if not deleted:
            logger.warning(f"Bookmark for content {content_id} not found for user {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Bookmark not found",
            )
        logger.info(f"Bookmark for content {content_id} deleted successfully for user {current_user.id}")
        return {"status": "success", "message": "Bookmark deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error deleting bookmark for content {content_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the bookmark",
        )