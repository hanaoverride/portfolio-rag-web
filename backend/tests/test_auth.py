"""Tests for auth endpoints."""

import pytest
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock, patch

from app.data.schemas import UserProfile, AuthTokens


@pytest.mark.asyncio
async def test_login_email_rejects_inactive_user(async_client, async_session):
    from app.data.models import User

    mock_user = MagicMock(spec=User)
    mock_user.id = 1
    mock_user.email = "inactive@test.com"
    mock_user.password_hash = "hashedpassword"
    mock_user.is_active = False
    mock_user.display_name = "Inactive User"
    mock_user.avatar_url = None
    mock_user.google_sub = None
    mock_user.last_login_at = None
    mock_user.created_at = datetime.now(timezone.utc)

    with patch("app.data.users_repository.get_user_by_email", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_user

        with patch("app.api.v1.auth.verify_password", return_value=True):
            response = await async_client.post(
                "/api/v1/auth/login/email",
                json={"email": "inactive@test.com", "password": "password123"},
            )

    assert response.status_code == 401
    assert response.json()["detail"] == "비활성화된 계정입니다"


@pytest.mark.asyncio
async def test_login_google_rejects_inactive_user(async_client, async_session):
    from app.data.models import User

    mock_user = MagicMock(spec=User)
    mock_user.id = 1
    mock_user.email = "inactive@test.com"
    mock_user.password_hash = None
    mock_user.is_active = False
    mock_user.display_name = "Inactive User"
    mock_user.avatar_url = None
    mock_user.google_sub = "google_123"
    mock_user.last_login_at = None
    mock_user.created_at = datetime.now(timezone.utc)

    with patch("app.data.users_repository.get_user_by_google_sub", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_user

        with patch("google.oauth2.id_token.verify_oauth2_token") as mock_verify:
            mock_verify.return_value = {"sub": "google_123", "email": "inactive@test.com", "name": "Inactive User"}

            with patch("app.api.v1.auth.settings") as mock_settings:
                mock_settings.google_client_ids = ["test-client-id"]

                response = await async_client.post(
                    "/api/v1/auth/login/google?token=valid_google_token",
                )

    assert response.status_code == 401
    assert response.json()["detail"] == "비활성화된 계정입니다"


@pytest.mark.asyncio
async def test_login_email_accepts_active_user(async_client, async_session):
    from app.data.models import User

    mock_user = MagicMock(spec=User)
    mock_user.id = 1
    mock_user.email = "active@test.com"
    mock_user.password_hash = "hashed_password"
    mock_user.is_active = True
    mock_user.display_name = "Active User"
    mock_user.avatar_url = None
    mock_user.google_sub = None
    mock_user.last_login_at = None
    mock_user.created_at = datetime.now(timezone.utc)

    with patch("app.data.users_repository.get_user_by_email", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_user

        with patch("app.api.v1.auth.verify_password", return_value=True):
            with patch("app.api.v1.auth.create_access_token") as mock_create_token:
                mock_create_token.return_value = "test_token"

                response = await async_client.post(
                    "/api/v1/auth/login/email",
                    json={"email": "active@test.com", "password": "password123"},
                )

    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data or "access_token" in data


@pytest.mark.asyncio
async def test_user_profile_has_display_name_field():
    now = datetime.now(timezone.utc)
    profile = UserProfile(
        id=1,
        email="test@example.com",
        display_name="Test User",
        avatar_url=None,
        created_at=now,
    )

    data = profile.model_dump(by_alias=True)
    assert "displayName" in data, f"Expected displayName in response, got: {data.keys()}"
    assert data["displayName"] == "Test User"
    assert "username" not in data


@pytest.mark.asyncio
async def test_user_profile_display_name_min_max_length():
    now = datetime.now(timezone.utc)

    with pytest.raises(ValueError):
        UserProfile(
            id=1,
            email="test@example.com",
            display_name="",
            avatar_url=None,
            created_at=now,
        )

    with pytest.raises(ValueError):
        UserProfile(
            id=1,
            email="test@example.com",
            display_name="a" * 51,
            avatar_url=None,
            created_at=now,
        )


@pytest.mark.asyncio
async def test_user_profile_alias_generation():
    now = datetime.now(timezone.utc)
    profile = UserProfile(
        id=123,
        email="user@example.com",
        display_name="John Doe",
        avatar_url=None,
        created_at=now,
    )

    data = profile.model_dump(by_alias=True)

    assert "id" in data
    assert "email" in data
    assert "displayName" in data
    assert "avatarUrl" in data
    assert "createdAt" in data
    assert "username" not in data


@pytest.mark.asyncio
async def test_login_response_includes_user_object():
    """Verify AuthTokens response includes user profile with displayName."""
    now = datetime.now(timezone.utc)
    user_profile = UserProfile(
        id=1,
        email="newuser@example.com",
        display_name="New User",
        avatar_url=None,
        created_at=now,
    )
    token = AuthTokens(
        access_token="test_token",
        user=user_profile,
        expires_at=now,
    )
    data = token.model_dump(by_alias=True)
    assert "accessToken" in data
    assert data["accessToken"] == "test_token"
    assert "user" in data
    assert data["user"]["displayName"] == "New User"
    assert data["user"]["email"] == "newuser@example.com"
    assert "expiresAt" in data
