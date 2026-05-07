from abc import ABC, abstractmethod
from dataclasses import dataclass, field


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
    async def chat(self, messages: list[ChatMessage]) -> str:
        ...

    @abstractmethod
    async def chat_with_rag(self, messages: list[ChatMessage], context: RAGContext) -> str:
        ...