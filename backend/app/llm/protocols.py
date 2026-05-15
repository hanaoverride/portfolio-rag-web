from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, AsyncGenerator


@dataclass
class ChatMessage:
    role: str
    content: str

    def to_dict(self) -> dict:
        return {"role": self.role, "content": self.content}


@dataclass
class RAGContext:
    chunks: list[str] = field(default_factory=list)


class ChatServiceProtocol(ABC):
    @abstractmethod
    async def chat(self, messages: list[ChatMessage]) -> str: ...

    @abstractmethod
    async def chat_with_rag(
        self, messages: list[ChatMessage], context: RAGContext
    ) -> str: ...

    @abstractmethod
    def stream(self, messages: list[ChatMessage]) -> AsyncGenerator[str, None]: ...

    @abstractmethod
    def stream_with_rag(
        self, messages: list[ChatMessage], context: RAGContext
    ) -> AsyncGenerator[str, None]: ...


class EmbeddingServiceProtocol(ABC):
    @abstractmethod
    async def get_embedding(self, text: str) -> list[float]: ...

    @abstractmethod
    async def get_embeddings(self, texts: list[str]) -> list[list[float]]: ...


@dataclass
class SearchResult:
    content: str
    metadata: dict[str, Any] = field(default_factory=dict)
    score: float = 0.0


class VectorStoreProtocol(ABC):
    @abstractmethod
    async def upsert(
        self,
        texts: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None: ...

    @abstractmethod
    async def search(
        self, query_embedding: list[float], limit: int = 5
    ) -> list[SearchResult]: ...
