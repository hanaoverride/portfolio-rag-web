from openai import AsyncOpenAI

from app.llm.protocols import ChatMessage, ChatServiceProtocol, RAGContext


class APIKeyMissingError(Exception):
    pass


class RealChatService(ChatServiceProtocol):
    def __init__(self) -> None:
        # API key resolution priority:
        # 1) OpenRouter API key
        # 2) OpenAI API key (fallback)
        # 3) None -> DEMO_MODE (fallback not using real API)
        # Resolve configuration at runtime to respect test-time overrides
        from app.config import settings as _settings

        key = None
        # settings may expose SecretStr; convert to raw value when present
        or_router = getattr(_settings, "openrouter_api_key", None)
        if or_router is not None:
            try:
                key = or_router.get_secret_value()
            except Exception:
                key = or_router  # fallback to raw if it's not a SecretStr
        if not key:
            ai_key = getattr(_settings, "openai_api_key", None)
            if ai_key is not None:
                try:
                    key = ai_key.get_secret_value()
                except Exception:
                    key = ai_key

        self._api_key = key
        base_url = (
            getattr(_settings, "openai_api_base", None) or _settings.openrouter_base_url
        )
        self._client = (
            AsyncOpenAI(api_key=self._api_key, base_url=base_url)
            if self._api_key
            else None
        )
        self._model = getattr(_settings, "openrouter_model", "gpt-oss-120b")

    def _require_api_key(self) -> None:
        if not self._api_key:
            raise APIKeyMissingError(
                "OPENAI_API_KEY is not set. Set DEMO_MODE=true for stub responses, "
                "or provide OPENAI_API_KEY for real LLM calls."
            )

    async def chat(self, messages: list[ChatMessage]) -> str:
        self._require_api_key()
        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[m.to_dict() for m in messages],
        )
        return response.choices[0].message.content or ""

    async def chat_with_rag(
        self, messages: list[ChatMessage], context: RAGContext
    ) -> str:
        self._require_api_key()
        system_prompt = self._build_rag_prompt(context)
        rag_messages = [ChatMessage(role="system", content=system_prompt)] + messages

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[m.to_dict() for m in rag_messages],
        )
        return response.choices[0].message.content or ""

    async def stream(self, messages: list[ChatMessage]):
        self._require_api_key()
        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[m.to_dict() for m in messages],
            stream=True,
        )
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def stream_with_rag(self, messages: list[ChatMessage], context: RAGContext):
        self._require_api_key()
        system_prompt = self._build_rag_prompt(context)
        rag_messages = [ChatMessage(role="system", content=system_prompt)] + messages

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[m.to_dict() for m in rag_messages],
            stream=True,
        )
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    def _build_rag_prompt(self, context: RAGContext) -> str:
        if not context.chunks:
            return "You are a helpful assistant. Use the provided context if available."

        context_text = "\n\n".join(
            f"[{i + 1}] {chunk}" for i, chunk in enumerate(context.chunks)
        )

        return f"""You are a helpful assistant. Use the following context to answer the user's question.

Context:
{context_text}

Instructions:
- Answer based on the provided context
- If the context doesn't contain relevant information, say so
- Cite which context chunk(s) you used when applicable"""
