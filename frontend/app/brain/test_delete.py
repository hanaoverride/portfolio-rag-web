import asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Test(Base):
    __tablename__ = "test"
    id: Mapped[int] = mapped_column(primary_key=True)

async def main():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    Session = async_sessionmaker(engine, class_=AsyncSession)
    async with Session() as session:
        t = Test(id=1)
        session.add(t)
        await session.commit()
        
        t = await session.get(Test, 1)
        res = session.delete(t)
        print(f"session.delete(t) returned: {type(res)}")
        print("Attempting to await session.delete(t)...")
        try:
            await session.delete(t)
            print("Success (unexpected)")
        except TypeError as e:
            print(f"Caught expected TypeError: {e}")
        except Exception as e:
            print(f"Caught unexpected exception: {type(e).__name__}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
