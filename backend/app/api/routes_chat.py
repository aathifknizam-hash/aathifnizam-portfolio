import logging
from fastapi import APIRouter, HTTPException

from ..models.schemas import ChatRequest, ChatResponse
from ..rag.pipeline import rag_pipeline

logger = logging.getLogger("uvicorn.error")
router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        return await rag_pipeline.answer_chat(request.question)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error))
    except Exception as e:
        logger.exception(f"Unhandled exception in /api/chat endpoint: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail="Unable to process the chat request at this time.")
