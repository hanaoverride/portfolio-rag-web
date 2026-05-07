import pytest
from sqlalchemy import text


@pytest.mark.asyncio
async def test_database_engine_connection(test_engine):
    async with test_engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        assert result.scalar() == 1


@pytest.mark.asyncio
async def test_database_session(async_session):
    result = await async_session.execute(text("SELECT 1"))
    assert result.scalar() == 1