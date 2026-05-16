import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.config import Settings, get_settings
from app.data.schemas import ChatCompletionRequest
from app.llm.chat_service import APIKeyMissingError
from app.llm.embedding_service import get_embedding_service
from app.llm.protocols import ChatMessage, RAGContext
from app.llm.stub_chat_service import get_chat_service
from app.llm.vector_store import get_vector_store

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/completions")
async def chat_completions(
    request: ChatCompletionRequest,
    settings: Settings = Depends(get_settings),
):
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    try:
        service = get_chat_service()
        messages = []
        for m in request.messages:
            content = m.content
            try:
                parsed = json.loads(content)
                if isinstance(parsed, dict) and "content" in parsed:
                    content = parsed["content"]
            except (json.JSONDecodeError, TypeError):
                pass
            messages.append(ChatMessage(role=m.role, content=content))

        context = None
        if request.use_rag:
            # Perform RAG retrieval
            embedding_service = get_embedding_service()
            vector_store = get_vector_store()

            # Use the last user message as query (extracted above)
            query_text = next(
                (m.content for m in reversed(messages) if m.role == "user"), ""
            )

            if query_text:
                query_vector = await embedding_service.get_embedding(query_text)
                search_results = await vector_store.search(query_vector, limit=3)
                context = RAGContext(chunks=[res.content for res in search_results])

        if request.stream:

            async def generate():
                if context:
                    async for chunk in service.stream_with_rag(messages, context):
                        yield chunk
                else:
                    async for chunk in service.stream(messages):
                        yield chunk

            return StreamingResponse(generate(), media_type="text/event-stream")

        if context:
            response_text = await service.chat_with_rag(messages, context)
        else:
            response_text = await service.chat(messages)

        return {
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response_text,
                    },
                }
            ]
        }
    except APIKeyMissingError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        # Log the error for debugging
        print(f"Error in chat_completions: {e}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")
