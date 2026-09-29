"""
PRISM API Router – Simulator Registry
Exposes registry metadata endpoints.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List
import registry
from models.base import SimulatorMeta

router = APIRouter(prefix="/api/registry", tags=["Registry"])


@router.get("/", response_model=List[SimulatorMeta])
def list_simulators(
    subject: Optional[str] = Query(None, description="Filter by subject"),
    status: Optional[str] = Query(None, description="Filter by status"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    search: Optional[str] = Query(None, description="Search in title, description, tags"),
):
    """Return all simulators, optionally filtered."""
    sims = registry.get_all()

    if subject:
        sims = [s for s in sims if s.subject.value == subject.lower()]
    if status:
        sims = [s for s in sims if s.status.value == status.lower()]
    if difficulty:
        sims = [s for s in sims if s.difficulty.value == difficulty.lower()]
    if search:
        q = search.lower()
        sims = [
            s for s in sims
            if q in s.title.lower()
            or q in s.description.lower()
            or any(q in tag.lower() for tag in s.tags)
            or q in s.topic.lower()
        ]

    return sims


@router.get("/subjects")
def list_subjects():
    """Return all subjects with simulator counts."""
    all_sims = registry.get_all()
    subjects: dict = {}
    for s in all_sims:
        key = s.subject.value
        if key not in subjects:
            subjects[key] = {"subject": key, "total": 0, "available": 0}
        subjects[key]["total"] += 1
        if s.status.value == "available":
            subjects[key]["available"] += 1
    return list(subjects.values())


@router.get("/{simulator_id}", response_model=SimulatorMeta)
def get_simulator(simulator_id: str):
    """Return metadata for a specific simulator."""
    sim = registry.get_by_id(simulator_id)
    if not sim:
        raise HTTPException(status_code=404, detail=f"Simulator '{simulator_id}' not found")
    return sim
