import asyncio
import logging
from typing import List, Optional
from sqlalchemy import select
from app.data.database import SessionLocal
from app.data.models import Content, YouTuber, Notice
from app.llm.embedding_service import get_embedding_service
from app.llm.vector_store import get_vector_store

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def ingest_data():
    db = SessionLocal()
    embedding_service = get_embedding_service()
    vector_store = get_vector_store()

    try:
        # 1. Ingest Contents
        logger.info("Ingesting Contents...")
        result = db.execute(select(Content))
        contents = result.scalars().all()
        
        texts = []
        metadatas = []
        ids = []
        for content in contents:
            text = f"Title: {content.title}\nDescription: {content.description}\nAuthor: {content.author_name}\nContent: {content.body_content}"
            texts.append(text)
            metadatas.append({"type": "content", "id": content.id})
            ids.append(f"content_{content.id}")
        
        if texts:
            embeddings = await embedding_service.get_embeddings(texts)
            await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids)

        # 2. Ingest YouTubers
        logger.info("Ingesting YouTubers...")
        result = db.execute(select(YouTuber))
        youtubers = result.scalars().all()
        
        texts = []
        metadatas = []
        ids = []
        for yt in youtubers:
            text = f"YouTuber: {yt.name}\nDescription: {yt.description}\nCategories: {', '.join(yt.categories)}"
            texts.append(text)
            metadatas.append({"type": "youtuber", "id": yt.id})
            ids.append(f"youtuber_{yt.id}")
        
        if texts:
            embeddings = await embedding_service.get_embeddings(texts)
            await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids)

        # 3. Ingest Notices
        logger.info("Ingesting Notices...")
        result = db.execute(select(Notice))
        notices = result.scalars().all()
        
        texts = []
        metadatas = []
        ids = []
        for notice in notices:
            text = f"Notice: {notice.title}\nContent: {notice.content}"
            texts.append(text)
            metadatas.append({"type": "notice", "id": str(notice.id)})
            ids.append(f"notice_{notice.id}")
        
        if texts:
            embeddings = await embedding_service.get_embeddings(texts)
            await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas, ids=ids)

        logger.info("✅ Ingestion complete!")
    except Exception as e:
        logger.error(f"❌ Ingestion failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(ingest_data())
