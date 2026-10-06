"""
PRISM – Simple Harmonic Motion Simulation Engine
Uses NumPy and SciPy for harmonic oscillator physics.
"""
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult


class HarmonicRequest(BaseModel):
    mass: float = Field(1.0, gt=0, le=50, description="Mass in kg")
    spring_k: float = Field(25.0, gt=0, le=500, description="Spring constant k in N/m")
    damping: float = Field(0.1, ge=0, le=10, description="Damping coefficient b in N·s/m")
    initial_x: float = Field(1.0, description="Initial displacement in meters")
    time_max: float = Field(10.0, gt=0, le=60, description="Duration in seconds")
    steps: int = Field(500, ge=50, le=2000, description="Time steps")


def compute_harmonic(req: HarmonicRequest) -> SimulationResult:
    m = req.mass
    k = req.spring_k
    b = req.damping
    x0 = req.initial_x
    t_max = req.time_max

    omega0 = np.sqrt(k / m)
    gamma = b / (2 * m)

    t = np.linspace(0, t_max, req.steps)

    if gamma < omega0:
        # Underdamped
        omega_d = np.sqrt(omega0**2 - gamma**2)
        x = x0 * np.exp(-gamma * t) * (np.cos(omega_d * t) + (gamma / omega_d) * np.sin(omega_d * t))
        period = (2 * np.pi) / omega_d
        freq = 1.0 / period
    elif np.isclose(gamma, omega0):
        # Critically damped
        x = x0 * (1 + gamma * t) * np.exp(-gamma * t)
        period = (2 * np.pi) / omega0
        freq = 1.0 / period
    else:
        # Overdamped
        r1 = -gamma + np.sqrt(gamma**2 - omega0**2)
        r2 = -gamma - np.sqrt(gamma**2 - omega0**2)
        c1 = x0 * r2 / (r2 - r1)
        c2 = -x0 * r1 / (r2 - r1)
        x = c1 * np.exp(r1 * t) + c2 * np.exp(r2 * t)
        period = (2 * np.pi) / omega0
        freq = 1.0 / period

    v = np.gradient(x, t)
    ke = 0.5 * m * v**2
    pe = 0.5 * k * x**2
    total_e = ke + pe

    return SimulationResult(
        simulator_id="simple-harmonic-motion",
        success=True,
        data={
            "t": t.tolist(),
            "x": np.round(x, 4).tolist(),
            "v": np.round(v, 4).tolist(),
            "period": round(float(period), 3),
            "frequency": round(float(freq), 3),
            "omega0": round(float(omega0), 3),
            "max_energy": round(float(np.max(total_e)), 4),
        },
        metadata={"solver": "numpy_scipy_harmonic", "steps": req.steps}
    )
