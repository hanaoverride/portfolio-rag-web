"""Repository for users."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import User


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    """Get a user by email address."""
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_google_sub(session: AsyncSession, google_sub: str) -> User | None:
    """Get a user by Google subject identifier."""
    result = await session.execute(select(User).where(User.google_sub == google_sub))
    return result.scalar_one_or_none()


async def create_user(
    session: AsyncSession, email: str, password_hash: str | None, display_name: str
) -> User:
    """Create a new user."""
    user = User(email=email, password_hash=password_hash, display_name=display_name)
    session.add(user)
    await session.flush()
    await session.refresh(user)
    return user