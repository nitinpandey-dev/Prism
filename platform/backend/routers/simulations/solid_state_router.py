"""
PRISM API Router – Solid State Chemistry Simulator
"""
from fastapi import APIRouter, HTTPException
from simulations.chemistry.solid_state.engine import CrystalRequest, compute_crystal
from models.base import SimulationResult

router = APIRouter(prefix="/api/simulations/solid-state", tags=["Chemistry"])


@router.post("/", response_model=SimulationResult)
def run_crystal_simulation(req: CrystalRequest):
    """Compute crystal lattice atom positions and properties."""
    try:
        return compute_crystal(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/structures")
def get_supported_structures():
    """Return supported crystal structure types."""
    return {
        "structures": ["SC", "BCC", "FCC"],
        "descriptions": {
            "SC": "Simple Cubic – 1 atom/cell, APF 52.36%",
            "BCC": "Body-Centered Cubic – 2 atoms/cell, APF 68.02%",
            "FCC": "Face-Centered Cubic – 4 atoms/cell, APF 74.05%",
        }
    }
