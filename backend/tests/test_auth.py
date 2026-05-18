"""Tests for auth endpoints."""

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.data.schemas import AuthTokens, UserProfile


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
    mock_user.is_admin = False
    mock_user.role = "user"
    mock_user.created_at = datetime.now(timezone.utc)

    with patch(
        "app.data.users_repository.get_user_by_email", new_callable=AsyncMock
    ) as mock_get:
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
    mock_user.is_active = False
    mock_user.display_name = "Inactive User"
    mock_user.avatar_url = None
    mock_user.google_sub = "google_123"
    mock_user.last_login_at = None
    mock_user.is_admin = False
    mock_user.role = "user"
    mock_user.created_at = datetime.now(timezone.utc)

    with patch(
        "app.data.users_repository.get_user_by_google_sub", new_callable=AsyncMock
    ) as mock_get:
        mock_get.return_value = mock_user

        with patch("google.oauth2.id_token.verify_oauth2_token") as mock_verify:
            mock_verify.return_value = {
                "sub": "google_123",
                "email": "inactive@test.com",
                "name": "Inactive User",
            }

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
    mock_user.is_admin = False
    mock_user.role = "user"
    mock_user.created_at = datetime.now(timezone.utc)

    with patch(
        "app.data.users_repository.get_user_by_email", new_callable=AsyncMock
    ) as mock_get:
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
    assert "displayName" in data, (
        f"Expected displayName in response, got: {data.keys()}"
    )
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


@pytest.mark.asyncio
async def test_confirm_password_reset_success(async_client, async_session):
    import hashlib
    import secrets
    from datetime import datetime, timedelta, timezone

    from app.auth.service import get_password_hash, verify_password
    from app.data.models import PasswordResetToken, User

    # 1. Create a user
    user = User(
        email="reset_test@example.com",
        display_name="Reset User",
        password_hash=get_password_hash("old_password123"),
    )
    async_session.add(user)
    await async_session.flush()

    # 2. Create a reset token
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    async_session.add(reset_token)
    await async_session.flush()
    await async_session.commit()

    # 3. Request confirm password reset using JSON body and CamelCase alias
    response = await async_client.post(
        "/api/v1/auth/password/confirm",
        json={
            "token": token,
            "newPassword": "new_password_secure_123",
        },
    )

    # 4. Assert response
    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data or "access_token" in data

    # 5. Verify database state
    await async_session.refresh(user)
    await async_session.refresh(reset_token)
    assert verify_password("new_password_secure_123", user.password_hash)
    assert reset_token.used_at is not None


@pytest.mark.asyncio
async def test_confirm_password_reset_fails_if_same_password(
    async_client, async_session
):
    import hashlib
    import secrets
    from datetime import datetime, timedelta, timezone

    from app.auth.service import get_password_hash
    from app.data.models import PasswordResetToken, User

    # 1. Create a user
    user = User(
        email="reset_same_test@example.com",
        display_name="Reset Same User",
        password_hash=get_password_hash("same_password123"),
    )
    async_session.add(user)
    await async_session.flush()

    # 2. Create a reset token
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
    )
    async_session.add(reset_token)
    await async_session.flush()
    await async_session.commit()

    # 3. Request confirm password reset using identical password
    response = await async_client.post(
        "/api/v1/auth/password/confirm",
        json={
            "token": token,
            "newPassword": "same_password123",
        },
    )

    # 4. Assert response
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "이전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다"


@pytest.mark.asyncio
async def test_request_password_reset_success(async_client, async_session):
    from unittest.mock import patch

    from app.auth.service import get_password_hash
    from app.data.models import User

    # Create a user
    user = User(
        email="reset_success_test@example.com",
        display_name="Reset Success User",
        password_hash=get_password_hash("password123"),
    )
    async_session.add(user)
    await async_session.flush()
    await async_session.commit()

    # Request password reset, mocking the send_password_reset_email background task
    with patch("app.api.v1.auth.send_password_reset_email") as mock_send:
        response = await async_client.post(
            "/api/v1/auth/password/reset",
            json={"email": "reset_success_test@example.com"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Password reset email sent"
        assert "debugToken" not in data
        assert "debug_token" not in data

        # Verify background task was called
        mock_send.assert_called_once()
        args, _ = mock_send.call_args
        assert args[0] == "reset_success_test@example.com"
        assert "reset-password?token=" in args[1]


def test_send_password_reset_email_without_key():
    from unittest.mock import patch

    from app.config import settings
    from app.services.email import send_password_reset_email

    with patch.object(settings, "resend_api_key", None):
        result = send_password_reset_email("test@example.com", "http://test-link")
        assert result is False
