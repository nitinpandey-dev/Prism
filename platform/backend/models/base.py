"""
PRISM Base Models
Shared Pydantic models used across all simulations.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from enum import Enum


class SimulatorStatus(str, Enum):
    AVAILABLE = "available"
    COMING_SOON = "coming_soon"
    BETA = "beta"


class SubjectEnum(str, Enum):
    CHEMISTRY = "chemistry"
    PHYSICS = "physics"
    MATHEMATICS = "mathematics"
    BIOLOGY = "biology"
    COMPUTER_SCIENCE = "computer_science"


class DifficultyEnum(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class VisualizationTypeEnum(str, Enum):
    THREE_D = "3d"
    TWO_D = "2d"
    ANIMATION = "animation"
    GRAPH = "graph"
    DIAGRAM = "diagram"


class SimulatorMeta(BaseModel):
    """Registry metadata for a single simulator."""
    id: str
    title: str
    description: str
    subject: SubjectEnum
    topic: str
    difficulty: DifficultyEnum
    route: str
    status: SimulatorStatus
    learning_objectives: List[str] = []
    tags: List[str] = []
    visualization_type: VisualizationTypeEnum
    backend_endpoint: Optional[str] = None
    thumbnail_color: Optional[str] = None  # CSS gradient hint for cards
    icon: Optional[str] = None             # Emoji icon for the card


class SimulationResult(BaseModel):
    """Generic wrapper for simulation API responses."""
    simulator_id: str
    success: bool
    data: Dict[str, Any] = {}
    error: Optional[str] = None
    metadata: Dict[str, Any] = {}


class ErrorResponse(BaseModel):
    detail: str
    simulator_id: Optional[str] = None
