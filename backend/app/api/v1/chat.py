"""Chat completion API endpoint."""
from fastapi import APIRouter, Depends, HTTPException

from app.config import get_settings, Settings
from app.data.schemas import ChatCompletionRequest
from app.llm.stub_chat_service import get_chat_service
from app.llm.chat_service import APIKeyMissingError
from app.llm.protocols import ChatMessage

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
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")