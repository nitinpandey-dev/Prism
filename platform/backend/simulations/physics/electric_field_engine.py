"""
PRISM – Electric Field Simulation Engine
Uses NumPy for Coulomb electrostatic vector calculations, field lines, and potentials.
"""
import numpy as np
from pydantic import BaseModel, Field
from typing import List
from models.base import SimulationResult


class ChargeItem(BaseModel):
    x: float
    y: float
    q: float  # Charge in microCoulombs (µC)


class ElectricFieldRequest(BaseModel):
    charges: List[ChargeItem] = [
        ChargeItem(x=-50.0, y=0.0, q=1.0),
        ChargeItem(x=50.0, y=0.0, q=-1.0),
    ]
    grid_size: int = Field(25, ge=10, le=50, description="Vector field grid resolution")


def compute_electric_field(req: ElectricFieldRequest) -> SimulationResult:
    n = req.grid_size
    x = np.linspace(-120, 120, n)
    y = np.linspace(-120, 120, n)
    X, Y = np.meshgrid(x, y)

    Ex = np.zeros_like(X)
    Ey = np.zeros_like(Y)
    V = np.zeros_like(X)

    # Coulomb constant (scaled for visualization)
    k_e = 8.99e3

    for ch in req.charges:
        dx = X - ch.x
        dy = Y - ch.y
        r_sq = dx**2 + dy**2
        r = np.sqrt(r_sq)
        r_safe = np.maximum(r, 8.0)

        # Field components E = k * q / r^2 * (r_hat)
        E_mag = k_e * ch.q / (r_safe**2)
        Ex += E_mag * (dx / r_safe)
        Ey += E_mag * (dy / r_safe)

        # Electric potential V = k * q / r
        V += k_e * ch.q / r_safe

    # Magnitude and unit direction
    E_total = np.sqrt(Ex**2 + Ey**2)
    Ex_norm = np.where(E_total > 0, Ex / (E_total + 1e-6), 0)
    Ey_norm = np.where(E_total > 0, Ey / (E_total + 1e-6), 0)

    # Convert grid points for frontend rendering
    vectors = []
    for i in range(n):
        for j in range(n):
            vectors.append({
                "x": float(X[i, j]),
                "y": float(Y[i, j]),
                "ex": round(float(Ex_norm[i, j]), 3),
                "ey": round(float(Ey_norm[i, j]), 3),
                "magnitude": round(float(E_total[i, j]), 3),
                "potential": round(float(V[i, j]), 2),
            })

    return SimulationResult(
        simulator_id="electric-fields",
        success=True,
        data={
            "vectors": vectors,
            "charges": [ch.dict() for ch in req.charges],
            "max_field": round(float(np.max(E_total)), 2),
            "min_potential": round(float(np.min(V)), 2),
            "max_potential": round(float(np.max(V)), 2),
        },
        metadata={"engine": "numpy_coulomb_grid", "resolution": n}
    )
