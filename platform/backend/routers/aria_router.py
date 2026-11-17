"""
PRISM ARIA Companion API Router
===============================
Provides contextual Socratic conversational AI endpoints for students.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from database.connection import get_db
from database.models import AriaDialogue
from services.aria_service import generate_aria_response

router = APIRouter(prefix="/api/aria", tags=["ARIA AI Companion"])


class AriaChatRequest(BaseModel):
    question: str
    context: Optional[Dict[str, Any]] = None


@router.post("/chat")
def chat_with_aria(req: AriaChatRequest, db: Session = Depends(get_db)):
    result = generate_aria_response(req.question, req.context)

    # Persist dialogue record
    try:
        dialogue = AriaDialogue(
            mission_id=req.context.get("missionId", "PHY-001") if req.context else "PHY-001",
            sender="student",
            message=req.question,
            mood="idle",
        )
        db.add(dialogue)

        aria_reply = AriaDialogue(
            mission_id=req.context.get("missionId", "PHY-001") if req.context else "PHY-001",
            sender="aria",
            message=result["reply"],
            mood=result.get("mood", "guiding"),
        )
        db.add(aria_reply)
        db.commit()
    except Exception:
        pass  # non-blocking persistence

    return {
        "reply": result["reply"],
        "mood": result.get("mood", "guiding"),
        "provider": result.get("provider", "local_socratic_engine"),
    }

