"""
PRISM Progress & Persistence API Router
=======================================
Tracks student mission progress, scores, and launcher calibration telemetry.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database.connection import get_db
from database.models import StudentProfile, MissionProgress, CalibrationAttempt

router = APIRouter(prefix="/api/progress", tags=["Progress & Persistence"])


class MissionProgressUpdate(BaseModel):
    mission_id: str
    stage: str
    score: int = 0
    is_completed: bool = False


class AttemptLog(BaseModel):
    mission_id: str = "PHY-001"
    initial_speed: float
    launch_angle: float
    launch_azimuth: float = 0.0
    learning_mode: str = "school"
    miss_distance: float
    is_hit: bool
    score: int


@router.post("/mission")
def update_mission_progress(req: MissionProgressUpdate, db: Session = Depends(get_db)):
    progress = db.query(MissionProgress).filter(
        MissionProgress.mission_id == req.mission_id
    ).first()

    if not progress:
        progress = MissionProgress(
            student_id=1,
            mission_id=req.mission_id,
            stage=req.stage,
            best_score=req.score,
            attempts_count=1 if req.score > 0 else 0,
            is_completed=req.is_completed,
        )
        db.add(progress)
    else:
        progress.stage = req.stage
        if req.score > progress.best_score:
            progress.best_score = req.score
        if req.is_completed:
            progress.is_completed = True
        progress.attempts_count += 1

    db.commit()
    db.refresh(progress)
    return {
        "status": "success",
        "mission_id": progress.mission_id,
        "stage": progress.stage,
        "best_score": progress.best_score,
        "attempts_count": progress.attempts_count,
        "is_completed": progress.is_completed,
    }


@router.get("/mission/{mission_id}")
def get_mission_progress(mission_id: str, db: Session = Depends(get_db)):
    progress = db.query(MissionProgress).filter(
        MissionProgress.mission_id == mission_id
    ).first()

    if not progress:
        return {
            "mission_id": mission_id,
            "stage": "BRIEFING",
            "best_score": 0,
            "attempts_count": 0,
            "is_completed": False,
        }

    return {
        "mission_id": progress.mission_id,
        "stage": progress.stage,
        "best_score": progress.best_score,
        "attempts_count": progress.attempts_count,
        "is_completed": progress.is_completed,
    }


@router.post("/attempt")
def log_calibration_attempt(req: AttemptLog, db: Session = Depends(get_db)):
    attempt = CalibrationAttempt(
        mission_id=req.mission_id,
        initial_speed=req.initial_speed,
        launch_angle=req.launch_angle,
        launch_azimuth=req.launch_azimuth,
        learning_mode=req.learning_mode,
        miss_distance=req.miss_distance,
        is_hit=req.is_hit,
        score=req.score,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {"status": "recorded", "id": attempt.id}


@router.get("/attempts/{mission_id}")
def get_attempts(mission_id: str, limit: int = 10, db: Session = Depends(get_db)):
    attempts = db.query(CalibrationAttempt).filter(
        CalibrationAttempt.mission_id == mission_id
    ).order_by(CalibrationAttempt.created_at.desc()).limit(limit).all()

    return [
        {
            "id": a.id,
            "initial_speed": a.initial_speed,
            "launch_angle": a.launch_angle,
            "launch_azimuth": a.launch_azimuth,
            "miss_distance": a.miss_distance,
            "is_hit": a.is_hit,
            "score": a.score,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        }
        for a in attempts
    ]


@router.get("/stats")
def get_student_stats(db: Session = Depends(get_db)):
    total_attempts = db.query(CalibrationAttempt).count()
    successful_hits = db.query(CalibrationAttempt).filter(CalibrationAttempt.is_hit == True).count()
    completed_missions = db.query(MissionProgress).filter(MissionProgress.is_completed == True).count()

    return {
        "student": "Researcher-01",
        "current_world": "Physics World (Kepler-186f)",
        "completed_missions": completed_missions,
        "total_calibration_launches": total_attempts,
        "successful_hits": successful_hits,
        "hit_ratio_percent": round((successful_hits / total_attempts * 100) if total_attempts > 0 else 0, 1),
    }

