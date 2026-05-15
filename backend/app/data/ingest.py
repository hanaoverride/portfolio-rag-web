import asyncio
from typing import List
from sqlalchemy import select
from app.data.database import SessionLocal
from app.data.models import Content, YouTuber, Notice
from app.llm.embedding_service import get_embedding_service
from app.llm.vector_store import get_vector_store

async def ingest_data():
    db = SessionLocal()
    embedding_service = get_embedding_service()
    vector_store = get_vector_store()

    # 1. Ingest Contents
    print("Ingesting Contents...")
    result = db.execute(select(Content))
    contents = result.scalars().all()
    
    texts = []
    metadatas = []
    for content in contents:
        text = f"Title: {content.title}\nDescription: {content.description}\nAuthor: {content.author_name}\nContent: {content.body_content}"
        texts.append(text)
        metadatas.append({"type": "content", "id": content.id})
    
    if texts:
        embeddings = await embedding_service.get_embeddings(texts)
        await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas)

    # 2. Ingest YouTubers
    print("Ingesting YouTubers...")
    result = db.execute(select(YouTuber))
    youtubers = result.scalars().all()
    
    texts = []
    metadatas = []
    for yt in youtubers:
        text = f"YouTuber: {yt.name}\nDescription: {yt.description}\nCategories: {', '.join(yt.categories)}"
        texts.append(text)
        metadatas.append({"type": "youtuber", "id": yt.id})
    
    if texts:
        embeddings = await embedding_service.get_embeddings(texts)
        await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas)

    # 3. Ingest Notices
    print("Ingesting Notices...")
    result = db.execute(select(Notice))
    notices = result.scalars().all()
    
    texts = []
    metadatas = []
    for notice in notices:
        text = f"Notice: {notice.title}\nContent: {notice.content}"
        texts.append(text)
        metadatas.append({"type": "notice", "id": str(notice.id)})
    
    if texts:
        embeddings = await embedding_service.get_embeddings(texts)
        await vector_store.upsert(texts=texts, embeddings=embeddings, metadatas=metadatas)

    print("Ingestion complete!")
    db.close()

if __name__ == "__main__":
    asyncio.run(ingest_data())
