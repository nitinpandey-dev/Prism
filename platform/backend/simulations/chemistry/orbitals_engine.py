"""
PRISM – Hydrogen Atomic Orbitals Wavefunction Engine
Uses NumPy to compute analytical quantum wavefunctions ψ_nlm(r, θ, φ) and electron probability densities |ψ|².
"""
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult


class OrbitalRequest(BaseModel):
    orbital_type: str = Field("2px", description="Orbital type: 1s, 2s, 2px, 2py, 2pz, 3d_xy, 3d_z2")
    grid_res: int = Field(60, ge=30, le=120, description="Grid resolution for 2D slice")
    scale: float = Field(15.0, ge=5.0, le=40.0, description="Box spatial extent in Bohr radii (a0)")


def compute_atomic_orbital(req: OrbitalRequest) -> SimulationResult:
    n_pts = req.grid_res
    extent = req.scale
    x = np.linspace(-extent, extent, n_pts)
    y = np.linspace(-extent, extent, n_pts)
    X, Y = np.meshgrid(x, y)
    R = np.sqrt(X**2 + Y**2)
    Theta = np.arctan2(Y, X)

    # Wavefunction calculations
    orb = req.orbital_type.lower()
    if orb == "1s":
        n, l, m = 1, 0, 0
        psi = np.exp(-R)
        radial_nodes, angular_nodes = 0, 0
    elif orb == "2s":
        n, l, m = 2, 0, 0
        psi = (2.0 - R) * np.exp(-R / 2.0)
        radial_nodes, angular_nodes = 1, 0
    elif orb == "2px":
        n, l, m = 2, 1, 1
        psi = R * np.exp(-R / 2.0) * np.cos(Theta)
        radial_nodes, angular_nodes = 0, 1
    elif orb == "2py":
        n, l, m = 2, 1, -1
        psi = R * np.exp(-R / 2.0) * np.sin(Theta)
        radial_nodes, angular_nodes = 0, 1
    elif orb == "2pz":
        n, l, m = 2, 1, 0
        psi = R * np.exp(-R / 2.0) * np.sin(Theta)
        radial_nodes, angular_nodes = 0, 1
    elif orb == "3d_xy":
        n, l, m = 3, 2, -2
        psi = (R ** 2) * np.exp(-R / 3.0) * np.sin(2 * Theta)
        radial_nodes, angular_nodes = 0, 2
    elif orb == "3d_z2":
        n, l, m = 3, 2, 0
        psi = (R ** 2) * np.exp(-R / 3.0) * (3 * np.sin(Theta)**2 - 1.0)
        radial_nodes, angular_nodes = 0, 2
    else:
        n, l, m = 1, 0, 0
        psi = np.exp(-R)
        radial_nodes, angular_nodes = 0, 0

    prob_density = psi ** 2
    bohr_energy = -13.6 / (n ** 2)

    return SimulationResult(
        simulator_id="atomic-orbitals",
        success=True,
        data={
            "orbital": req.orbital_type,
            "quantum_numbers": {"n": n, "l": l, "m": m},
            "radial_nodes": radial_nodes,
            "angular_nodes": angular_nodes,
            "bohr_energy_ev": round(bohr_energy, 2),
            "max_prob_density": float(np.max(prob_density)),
            "density_matrix": np.round(prob_density[::2, ::2], 4).tolist(),
        },
        metadata={"engine": "numpy_schrodinger_solution", "resolution": f"{n_pts}x{n_pts}"}
    )
