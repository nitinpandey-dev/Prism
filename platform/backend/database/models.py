"""
PRISM Database ORM Models
=========================
Stores student progress, mission records, physics calibration logs, and ARIA dialogues.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base


class StudentProfile(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, default="Researcher-01")
    current_world = Column(String(32), default="Physics")
    level = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    missions = relationship("MissionProgress", back_populates="student")


class MissionProgress(Base):
    __tablename__ = "mission_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), default=1)
    mission_id = Column(String(32), index=True)  # e.g. "PHY-001"
    stage = Column(String(32), default="BRIEFING")
    best_score = Column(Integer, default=0)
    attempts_count = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("StudentProfile", back_populates="missions")


class CalibrationAttempt(Base):
    __tablename__ = "calibration_attempts"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String(32), index=True, default="PHY-001")
    initial_speed = Column(Float)
    launch_angle = Column(Float)
    launch_azimuth = Column(Float, default=0.0)
    learning_mode = Column(String(16), default="school")
    miss_distance = Column(Float)
    is_hit = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class AriaDialogue(Base):
    __tablename__ = "aria_dialogues"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(String(32), default="PHY-001")
    sender = Column(String(16))  # "student" | "aria"
    message = Column(Text)
    mood = Column(String(16), default="guiding")
    created_at = Column(DateTime, default=datetime.utcnow)

