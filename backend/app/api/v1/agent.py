from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.agent_service import agent_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str
    thought: Optional[str] = None
    clarification_needed: bool

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Endpoint for multi-turn chat with the AI Bureaucracy Consultant.
    """
    try:
        result = agent_service.chat(request.message, request.history)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return ChatResponse(
            response=result["response"],
            thought=result.get("thought"),
            clarification_needed=result.get("clarification_needed", False)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
