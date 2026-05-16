import asyncio

from sqlalchemy import text

from app.data.database import get_async_engine


async def test():
    try:
        engine = get_async_engine()
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1"))
            print(f"DB Connection OK: {res.scalar()}")
    except Exception as e:
        print(f"DB Connection FAILED: {e}")


if __name__ == "__main__":
    asyncio.run(test())
