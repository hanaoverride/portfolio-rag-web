from __future__ import annotations

import sys
from typing import AsyncGenerator
from unittest.mock import MagicMock

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

test_settings = MagicMock()
test_settings.database_url = "sqlite+aiosqlite:///file::memory:?cache=shared&uri=true"
test_settings.service_name = "test-service"
test_settings.api_prefix = "/api/v1"
test_settings.allowed_origins = ["http://localhost:3000"]
test_settings.trusted_hosts = ["localhost", "127.0.0.1"]
test_settings.jwt_secret_key = MagicMock()
test_settings.jwt_secret_key.get_secret_value.return_value = (
    "test-secret-key-for-testing-only12"
)
test_settings.jwt_access_token_exp_minutes = 15
test_settings.jwt_algorithm = "HS256"
test_settings.google_client_ids = []
test_settings.openai_api_key = None
test_settings.openai_api_base = "https://openrouter.ai/api/v1"
test_settings.openai_chat_model = "gpt-oss-120b"
test_settings.qdrant_url = None
test_settings.qdrant_api_key = None
test_settings.qdrant_collection_name = "test"
test_settings.demo_mode = True
test_settings.cache_ttl_seconds = 300

mock_config = MagicMock()
mock_config.get_settings.return_value = test_settings
mock_config.settings = test_settings
mock_config.Settings = MagicMock()

sys.modules["app.config"] = mock_config

TEST_DATABASE_URL = "sqlite+aiosqlite:///file::memory:?cache=shared&uri=true"


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    import app.data.models  # noqa: F401
    from app.data.database import Base

    engine = create_async_engine(TEST_DATABASE_URL, echo=False)

    # Keep one connection open to keep the shared memory database alive during testing
    keep_alive_conn = await engine.connect()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    await keep_alive_conn.close()
    await engine.dispose()


@pytest_asyncio.fixture(scope="session")
async def test_session_maker(test_engine):
    session_maker = async_sessionmaker(
        bind=test_engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
        class_=AsyncSession,
    )
    return session_maker


@pytest_asyncio.fixture(scope="function")
async def async_session(test_session_maker) -> AsyncGenerator[AsyncSession, None]:
    async with test_session_maker() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    from app.main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
