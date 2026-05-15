from typing import List, Optional, Any
import uuid
from qdrant_client import QdrantClient, AsyncQdrantClient
from qdrant_client.http import models as qmodels
from app.llm.protocols import VectorStoreProtocol, SearchResult
from app.config import settings

class QdrantVectorStore(VectorStoreProtocol):
    def __init__(self) -> None:
        self._url = settings.qdrant_url
        self._api_key = settings.qdrant_api_key.get_secret_value() if settings.qdrant_api_key else None
        self._collection_name = settings.qdrant_collection_name
        self._client: Optional[AsyncQdrantClient] = None

    async def _get_client(self) -> AsyncQdrantClient:
        if self._client is None:
            if self._url:
                self._client = AsyncQdrantClient(url=self._url, api_key=self._api_key)
            else:
                # Fallback to in-memory if no URL provided (for local dev/demo)
                self._client = AsyncQdrantClient(":memory:")
            
            # Ensure collection exists
            collections = await self._client.get_collections()
            exists = any(c.name == self._collection_name for c in collections.collections)
            if not exists:
                await self._client.create_collection(
                    collection_name=self._collection_name,
                    vectors_config=qmodels.VectorParams(size=1536, distance=qmodels.Distance.COSINE),
                )
        return self._client

    async def upsert(
        self, 
        texts: List[str], 
        embeddings: List[List[float]], 
        metadatas: Optional[List[dict[str, Any]]] = None,
        ids: Optional[List[str]] = None
    ) -> None:
        client = await self._get_client()
        points = []
        for i, (text, vector) in enumerate(zip(texts, embeddings)):
            payload = {"text": text}
            if metadatas and i < len(metadatas):
                payload.update(metadatas[i])
            
            point_id = ids[i] if ids and i < len(ids) else str(uuid.uuid4())
            
            points.append(qmodels.PointStruct(
                id=point_id,
                vector=vector,
                payload=payload
            ))
        
        await client.upsert(
            collection_name=self._collection_name,
            points=points
        )

    async def search(self, query_embedding: List[float], limit: int = 5) -> List[SearchResult]:
        client = await self._get_client()
        results = await client.search(
            collection_name=self._collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        
        return [
            SearchResult(
                content=res.payload.get("text", ""),
                metadata={k: v for k, v in res.payload.items() if k != "text"},
                score=res.score
            )
            for res in results
        ]

def get_vector_store() -> VectorStoreProtocol:
    return QdrantVectorStore()
