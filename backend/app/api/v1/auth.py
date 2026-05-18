"""Authentication API routes."""

from __future__ import annotations

import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.auth.service import (
    create_access_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.config import settings
from app.data.database import get_db
from app.data.models import PasswordResetToken, RevokedToken, User
from app.data.schemas import (
    AuthTokens,
    LoginRequest,
    PasswordResetConfirmRequest,
    PasswordResetInitResponse,
    PasswordResetRequest,
    RegisterRequest,
    UserProfile,
)

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post(
    "/register", response_model=AuthTokens, status_code=status.HTTP_201_CREATED
)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> AuthTokens:
    """Register a new user."""
    from app.data.users_repository import get_user_by_email

    existing_user = await get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다",
        )

    password_hash = get_password_hash(request.password)
    from app.data.users_repository import create_user

    user = await create_user(
        db,
        email=request.email,
        password_hash=password_hash,
        display_name=request.display_name,
    )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_profile = UserProfile(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        is_admin=user.is_admin,
        role=user.role,
        created_at=user.created_at,
    )
    return AuthTokens(access_token=access_token, user=user_profile)


@router.post("/login/email", response_model=AuthTokens)
async def login_email(
    request: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> AuthTokens:
    """Login with email and password."""
    from app.data.users_repository import get_user_by_email

    user = await get_user_by_email(db, request.email)
    if not user or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="계정이 없거나 비밀번호가 올바르지 않습니다",
        )

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="계정이 없거나 비밀번호가 올바르지 않습니다",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="비활성화된 계정입니다",
        )

    user.last_login_at = datetime.now(timezone.utc)
    await db.flush()

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_profile = UserProfile(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        is_admin=user.is_admin,
        role=user.role,
        created_at=user.created_at,
    )
    return AuthTokens(access_token=access_token, user=user_profile)


@router.post("/login/google", response_model=AuthTokens)
async def login_google(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> AuthTokens:
    """Login or register with a Google ID token."""
    from app.data.users_repository import create_user, get_user_by_google_sub

    try:
        from google.auth.transport import requests
        from google.oauth2 import id_token

        if not settings.google_client_ids:
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="Google login not configured",
            )

        id_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.google_client_ids[0],
        )

        google_sub = id_info["sub"]
        email = id_info["email"]
        name = id_info.get("name", email.split("@")[0])

    except Exception:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    user = await get_user_by_google_sub(db, google_sub)
    if not user:
        user = await create_user(db, email=email, password_hash=None, display_name=name)
        user.google_sub = google_sub
        await db.flush()

    user.last_login_at = datetime.now(timezone.utc)
    await db.flush()

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="비활성화된 계정입니다",
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_profile = UserProfile(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        is_admin=user.is_admin,
        role=user.role,
        created_at=user.created_at,
    )
    return AuthTokens(access_token=access_token, user=user_profile)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    token: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Logout by revoking the current token."""
    try:
        payload = decode_token(token)
        expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        revoked = RevokedToken(
            token_hash=hashlib.sha256(token.encode()).hexdigest(),
            expires_at=expires_at,
        )
        db.add(revoked)
        await db.flush()
    except JWTError:
        pass


@router.post("/password/reset", response_model=PasswordResetInitResponse)
async def request_password_reset(
    request: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
) -> PasswordResetInitResponse:
    """Request a password reset email."""
    import secrets

    from app.data.users_repository import get_user_by_email

    user = await get_user_by_email(db, request.email)
    if user:
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()

        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        )
        db.add(reset_token)
        await db.flush()

        # Include debugToken in dev mode only
        is_dev = settings.environment in ("local", "development") or settings.demo_mode
        return PasswordResetInitResponse(
            message="Password reset email sent",
            debug_token=token if is_dev else None,
        )

    # Always return success to prevent email enumeration
    return PasswordResetInitResponse(message="Password reset email sent")


@router.post("/password/confirm", response_model=AuthTokens)
async def confirm_password_reset(
    request: PasswordResetConfirmRequest,
    db: AsyncSession = Depends(get_db),
) -> AuthTokens:
    """Reset password using a valid token."""
    from sqlalchemy import select
    from sqlalchemy.orm import selectinload

    token_hash = hashlib.sha256(request.token.encode()).hexdigest()
    result = await db.execute(
        select(PasswordResetToken)
        .options(selectinload(PasswordResetToken.user))
        .where(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > datetime.now(timezone.utc),
        )
    )
    reset_token = result.scalar_one_or_none()

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    user = reset_token.user
    if user.password_hash and verify_password(request.new_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다",
        )

    user.password_hash = get_password_hash(request.new_password)
    reset_token.used_at = datetime.now(timezone.utc)
    await db.flush()

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    user_profile = UserProfile(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        is_admin=user.is_admin,
        role=user.role,
        created_at=user.created_at,
    )
    return AuthTokens(access_token=access_token, user=user_profile)


@router.get("/me", response_model=UserProfile)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserProfile:
    """Get current user profile."""
    return UserProfile(
        id=current_user.id,
        email=current_user.email,
        display_name=current_user.display_name,
        avatar_url=current_user.avatar_url,
        is_admin=current_user.is_admin,
        role=current_user.role,
        created_at=current_user.created_at,
    )
