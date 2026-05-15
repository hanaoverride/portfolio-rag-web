"""Chat completion API endpoint."""
from fastapi import APIRouter, Depends, HTTPException

from app.config import get_settings, Settings
from app.data.schemas import ChatCompletionRequest
from app.llm.stub_chat_service import get_chat_service
from app.llm.chat_service import APIKeyMissingError
from app.llm.embedding_service import get_embedding_service
from app.llm.vector_store import get_vector_store
from app.llm.protocols import ChatMessage, RAGContext

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/completions")
async def chat_completions(
    request: ChatCompletionRequest,
    settings: Settings = Depends(get_settings),
):
    if request.stream:
        raise HTTPException(status_code=400, detail="Streaming is not supported")

    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")

    try:
        service = get_chat_service()
        messages = [ChatMessage(role=m.role, content=m.content) for m in request.messages]
        
        if request.use_rag:
            # Perform RAG retrieval
            embedding_service = get_embedding_service()
            vector_store = get_vector_store()
            
            # Use the last user message as query
            query_text = next((m.content for m in reversed(request.messages) if m.role == "user"), "")
            if query_text:
                query_vector = await embedding_service.get_embedding(query_text)
                search_results = await vector_store.search(query_vector, limit=3)
                
                context = RAGContext(chunks=[res.content for res in search_results])
                response_text = await service.chat_with_rag(messages, context)
            else:
                response_text = await service.chat(messages)
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