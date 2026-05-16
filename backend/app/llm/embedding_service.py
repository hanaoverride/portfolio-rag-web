from typing import List

from openai import AsyncOpenAI

from app.config import settings
from app.llm.protocols import EmbeddingServiceProtocol


class OpenAIEmbeddingService(EmbeddingServiceProtocol):
    def __init__(self) -> None:
        key = None
        or_router = getattr(settings, "openrouter_api_key", None)
        if or_router is not None:
            try:
                key = or_router.get_secret_value()
            except Exception:
                key = or_router
        if not key:
            ai_key = getattr(settings, "openai_api_key", None)
            if ai_key is not None:
                try:
                    key = ai_key.get_secret_value()
                except Exception:
                    key = ai_key

        self._api_key = key
        # Note: OpenRouter might not support embeddings well, or might use different endpoints.
        # Usually OpenAI's endpoint is used for embeddings.
        base_url = getattr(settings, "openai_api_base", None)
        self._client = (
            AsyncOpenAI(api_key=self._api_key, base_url=base_url)
            if self._api_key
            else None
        )
        self._model = "text-embedding-3-small"

    async def get_embedding(self, text: str) -> List[float]:
        if not self._client:
            # Return dummy embedding in demo/stub mode
            return [0.1] * 1536

        response = await self._client.embeddings.create(
            input=[text.replace("\n", " ")], model=self._model
        )
        return response.data[0].embedding

    async def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self._client:
            return [[0.1] * 1536 for _ in texts]

        cleaned_texts = [text.replace("\n", " ") for text in texts]
        response = await self._client.embeddings.create(
            input=cleaned_texts, model=self._model
        )
        return [data.embedding for data in response.data]


def get_embedding_service() -> EmbeddingServiceProtocol:
    return OpenAIEmbeddingService()
