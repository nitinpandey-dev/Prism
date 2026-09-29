"""
PRISM API Router – Projectile Motion Simulator
"""
from fastapi import APIRouter, HTTPException
from simulations.physics.projectile_motion.engine import ProjectileRequest, compute_projectile
from models.base import SimulationResult

router = APIRouter(prefix="/api/simulations/projectile-motion", tags=["Physics"])


@router.post("/", response_model=SimulationResult)
def run_projectile(req: ProjectileRequest):
    """Compute projectile trajectory."""
    try:
        return compute_projectile(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
