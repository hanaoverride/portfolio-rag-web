import asyncio
import logging
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.data.database import get_async_engine
from app.data.models import Content, Notice, YouTuber
from app.llm.embedding_service import get_embedding_service
from app.llm.vector_store import get_vector_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Deterministic namespace for UUID generation
NAMESPACE_PORTFOLIO = uuid.uuid5(uuid.NAMESPACE_DNS, "portfolio.layer.ai")


def get_deterministic_uuid(source_type: str, source_id: any) -> str:
    """Generate a deterministic UUID based on source type and ID."""
    return str(uuid.uuid5(NAMESPACE_PORTFOLIO, f"{source_type}_{source_id}"))


async def ingest_data():
    engine = get_async_engine()
    embedding_service = get_embedding_service()
    vector_store = get_vector_store()

    async with AsyncSession(engine) as session:
        try:
            # 1. Ingest Contents
            logger.info("Ingesting Contents...")
            result = await session.execute(select(Content))
            contents = result.scalars().all()

            texts = []
            metadatas = []
            ids = []
            for content in contents:
                text = f"Title: {content.title}\nDescription: {content.description}\nAuthor: {content.author_name}\nContent: {content.body_content}"
                texts.append(text)
                metadatas.append({"type": "content", "id": content.id})
                ids.append(get_deterministic_uuid("content", content.id))

            if texts:
                embeddings = await embedding_service.get_embeddings(texts)
                await vector_store.upsert(
                    texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids
                )

            # 2. Ingest YouTubers
            logger.info("Ingesting YouTubers...")
            result = await session.execute(select(YouTuber))
            youtubers = result.scalars().all()

            texts = []
            metadatas = []
            ids = []
            for yt in youtubers:
                text = f"YouTuber: {yt.name}\nDescription: {yt.description}\nCategories: {', '.join(yt.categories)}"
                texts.append(text)
                metadatas.append({"type": "youtuber", "id": yt.id})
                ids.append(get_deterministic_uuid("youtuber", yt.id))

            if texts:
                embeddings = await embedding_service.get_embeddings(texts)
                await vector_store.upsert(
                    texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids
                )

            # 3. Ingest Notices
            logger.info("Ingesting Notices...")
            result = await session.execute(select(Notice))
            notices = result.scalars().all()

            texts = []
            metadatas = []
            ids = []
            for notice in notices:
                text = f"Notice: {notice.title}\nContent: {notice.content}"
                texts.append(text)
                metadatas.append({"type": "notice", "id": str(notice.id)})
                ids.append(get_deterministic_uuid("notice", notice.id))

            if texts:
                embeddings = await embedding_service.get_embeddings(texts)
                await vector_store.upsert(
                    texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids
                )

            logger.info("✅ Ingestion complete!")
        except Exception as e:
            logger.error(f"❌ Ingestion failed: {e}")
            raise
        finally:
            await session.close()


if __name__ == "__main__":
    asyncio.run(ingest_data())
