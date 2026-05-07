"""Comment API routes."""
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.comments_repository import create_comment, delete_comment, get_content_comments, update_comment
from app.data.database import get_db
from app.data.models import User
from app.data.schemas import CommentResponse, PaginatedCommentsResponse, CreateCommentRequest
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/contents", tags=["comments"])


@router.get("/{content_id}/comments", response_model=PaginatedCommentsResponse)
async def list_comments(
    content_id: str,
    offset: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
) -> PaginatedCommentsResponse:
    """List comments for a content (public)."""
    comments, total = await get_content_comments(db, content_id, offset, limit)

    items = [
        CommentResponse(
            id=c.id,
            content_id=c.content_id,
            user_id=c.user_id,
            text=c.text,
            author_name=c.user.display_name,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in comments
    ]

    return PaginatedCommentsResponse(items=items, total=total, limit=limit, offset=offset)


@router.post("/{content_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment_route(
    content_id: str,
    request: CreateCommentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    """Create a comment on content (protected)."""
    text = request.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment text cannot be empty",
        )

    comment = await create_comment(db, content_id, current_user.id, text)

    return CommentResponse(
        id=comment.id,
        content_id=comment.content_id,
        user_id=comment.user_id,
        text=comment.text,
        author_name=current_user.display_name,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )


@router.put("/{content_id}/comments/{comment_id}", response_model=CommentResponse)
async def update_comment_route(
    content_id: str,
    comment_id: int,
    request: CreateCommentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CommentResponse:
    """Update a comment (protected, owner only)."""
    text = request.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment text cannot be empty",
        )

    comment = await update_comment(db, comment_id, current_user.id, text)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or not authorized",
        )

    return CommentResponse(
        id=comment.id,
        content_id=comment.content_id,
        user_id=comment.user_id,
        text=comment.text,
        author_name=current_user.display_name,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )


@router.delete("/{content_id}/comments/{comment_id}")
async def delete_comment_route(
    content_id: str,
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Delete a comment (protected, owner only)."""
    logger.info(f"Delete request for comment {comment_id} on content {content_id} by user {current_user.id}")
    try:
        deleted = await delete_comment(db, comment_id, current_user.id)
        if not deleted:
            logger.warning(f"Comment {comment_id} not found or not authorized for user {current_user.id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Comment not found or not authorized",
            )
        logger.info(f"Comment {comment_id} deleted successfully")
        return {"status": "success", "message": "Comment deleted"}
    except HTTPException:
        # Re-raise HTTP exceptions as-is, they are handled by FastAPI
        raise
    except Exception as e:
        logger.error(f"Unexpected error deleting comment {comment_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while deleting the comment",
        )