"""
PRISM API Router – Simple Harmonic Motion
"""
from fastapi import APIRouter, HTTPException
from simulations.physics.harmonic_engine import HarmonicRequest, compute_harmonic
from models.base import SimulationResult

router = APIRouter(prefix="/api/simulations/simple-harmonic-motion", tags=["Physics"])


@router.post("", response_model=SimulationResult, include_in_schema=False)
@router.post("/", response_model=SimulationResult)
def run_harmonic(req: HarmonicRequest):
    try:
        return compute_harmonic(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
