"""Pydantic schemas for API request/response validation."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, constr
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        str_strip_whitespace=True,
    )


class RegisterRequest(CamelModel):
    email: constr(
        min_length=1,
        max_length=255,
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
    )
    password: constr(min_length=8, max_length=128)
    display_name: constr(min_length=1, max_length=50)


class LoginRequest(CamelModel):
    email: constr(
        min_length=1,
        max_length=255,
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
    )
    password: constr(min_length=1, max_length=128)


class PasswordResetRequest(CamelModel):
    email: constr(
        min_length=1,
        max_length=255,
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
    )


class PasswordResetConfirmRequest(CamelModel):
    token: constr(min_length=1)
    new_password: constr(min_length=8, max_length=128)


class PasswordResetInitResponse(CamelModel):
    message: str
    debug_token: Optional[str] = None


class CreateCommentRequest(CamelModel):
    text: constr(min_length=1, max_length=500)


class CreateBookmarkRequest(CamelModel):
    content_id: constr(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_-]+$")


class ChatMessagePayload(BaseModel):
    role: str = Field(default="user")
    content: str = Field(default="")


class ChatCompletionRequest(CamelModel):
    messages: List[ChatMessagePayload] = Field(default_factory=list)
    temperature: Optional[float] = None
    stream: Optional[bool] = False
    use_rag: bool = Field(default=False)


class Author(CamelModel):
    name: constr(min_length=1, max_length=100)
    avatar: HttpUrl


class TableOfContentsItem(CamelModel):
    id: constr(min_length=1, max_length=60, pattern=r"^[A-Za-z0-9_-]+$")
    title: constr(min_length=1, max_length=150)
    emoji: Optional[constr(max_length=4)] = None
    level: int = Field(ge=1, le=3)
    timestamp: Optional[int] = Field(default=None, ge=0, le=36000)


class ContentResponse(CamelModel):
    id: constr(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_-]+$")
    title: constr(min_length=1, max_length=180)
    description: constr(min_length=1, max_length=5000)
    thumbnail: HttpUrl
    video_url: HttpUrl
    category: List[constr(min_length=1, max_length=50)]
    author: Author
    duration: int = Field(ge=0, le=21600)
    views: int = Field(ge=0, le=100_000_000)
    created_at: datetime
    table_of_contents: List[TableOfContentsItem] = Field(default_factory=list)
    body_content: constr(min_length=1)
    related_contents: List[
        constr(min_length=1, max_length=40, pattern=r"^[A-Za-z0-9_-]+$")
    ] = Field(default_factory=list)
    is_new: Optional[bool] = None


class CategoryResponse(CamelModel):
    id: constr(min_length=1, max_length=60, pattern=r"^[A-Za-z0-9_-]+$")
    name: constr(min_length=1, max_length=120)
    slug: constr(min_length=1, max_length=120, pattern=r"^[a-z0-9-]+$")


class YouTuberResponse(CamelModel):
    id: constr(min_length=1, max_length=60, pattern=r"^[A-Za-z0-9_-]+$")
    name: constr(min_length=1, max_length=120)
    avatar: HttpUrl
    channel_url: HttpUrl
    subscribers: int = Field(ge=0, le=100_000_000)
    description: constr(min_length=1, max_length=5000)
    categories: List[constr(min_length=1, max_length=50)]
    content_count: int = Field(ge=0, le=10000)


class UserProfile(CamelModel):
    id: int
    email: str
    display_name: constr(min_length=1, max_length=50)
    avatar_url: Optional[HttpUrl] = None
    is_admin: bool = False
    role: UserRole = UserRole.USER
    created_at: datetime


class AuthTokens(CamelModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "Bearer"
    user: Optional["UserProfile"] = None
    expires_at: Optional[datetime] = None


class CommentResponse(CamelModel):
    id: int
    content_id: str
    user_id: int
    text: str
    author_name: str
    created_at: datetime
    updated_at: datetime


class BookmarkResponse(CamelModel):
    content: ContentResponse
    bookmarked_at: datetime


class ChatCompletionResponse(CamelModel):
    message: str
    generated_at: datetime


class PaginatedResponse(CamelModel, Generic[T]):
    items: List[T]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class ContentListResponse(PaginatedResponse[ContentResponse]):
    pass


class PaginatedCommentsResponse(CamelModel):
    items: List[CommentResponse]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class PaginatedBookmarksResponse(CamelModel):
    items: List[BookmarkResponse]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class PaginatedYouTubersResponse(CamelModel):
    items: List[YouTuberResponse]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class PaginatedCategoriesResponse(CamelModel):
    items: List[CategoryResponse]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class HealthResponse(CamelModel):
    status: constr(pattern=r"^[a-z-]+$")
    service: str


class NoticeResponse(CamelModel):
    id: int
    title: str
    content: str
    is_important: bool
    created_at: datetime
    updated_at: datetime
    author_name: str


class CreateNoticeRequest(CamelModel):
    title: constr(min_length=1, max_length=200)
    content: constr(min_length=1)
    is_important: bool = False


class PaginatedNoticesResponse(CamelModel):
    items: List[NoticeResponse]
    total: int = Field(ge=0)
    limit: int = Field(ge=1)
    offset: int = Field(ge=0)


class CreateNotificationRequest(CamelModel):
    title: constr(min_length=1, max_length=200)
    message: constr(min_length=1)
    user_id: Optional[int] = None  # Specific user or global if None


class NotificationResponse(CamelModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime
    user_id: Optional[int] = None


class StatisticsResponse(CamelModel):
    total_bookmarks: int = Field(ge=0)
    total_comments: int = Field(ge=0)
    total_contents: int = Field(ge=0)
    total_views: int = Field(ge=0)
    total_youtubers: int = Field(ge=0)
