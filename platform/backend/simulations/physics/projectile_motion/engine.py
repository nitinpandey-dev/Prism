"""
PRISM – Projectile Motion Simulator
Uses NumPy for trajectory computation.
"""
import numpy as np
from pydantic import BaseModel, Field
from typing import Optional
from models.base import SimulationResult


class ProjectileRequest(BaseModel):
    initial_speed: float = Field(
        30.0, gt=0, le=500, description="Launch speed in m/s"
    )
    launch_angle: float = Field(
        45.0, ge=0, le=90, description="Launch angle in degrees"
    )
    initial_height: float = Field(
        0.0, ge=0, le=1000, description="Initial height in meters"
    )
    gravity: float = Field(
        9.81, gt=0, le=30, description="Gravitational acceleration in m/s²"
    )
    time_steps: int = Field(
        500, ge=50, le=5000, description="Number of time steps for trajectory"
    )


def compute_projectile(req: ProjectileRequest) -> SimulationResult:
    v0 = req.initial_speed
    theta = np.radians(req.launch_angle)
    h0 = req.initial_height
    g = req.gravity

    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)

    # Time of flight (quadratic: h0 + vy*t - 0.5*g*t² = 0)
    discriminant = vy**2 + 2 * g * h0
    t_flight = (vy + np.sqrt(discriminant)) / g if discriminant >= 0 else (vy / g)

    t = np.linspace(0, t_flight, req.time_steps)
    x = vx * t
    y = h0 + vy * t - 0.5 * g * t**2

    # Clip below ground
    valid = y >= -1e-9
    x = x[valid].tolist()
    y = np.clip(y[valid], 0, None).tolist()
    t_valid = t[valid].tolist()

    # Max height
    t_max_h = vy / g
    max_height = h0 + vy * t_max_h - 0.5 * g * t_max_h**2 if t_max_h > 0 else h0

    # Range
    horizontal_range = x[-1] if x else 0.0

    return SimulationResult(
        simulator_id="projectile-motion",
        success=True,
        data={
            "trajectory": {"x": x, "y": y, "t": t_valid},
            "initial_speed": v0,
            "launch_angle": req.launch_angle,
            "initial_height": h0,
            "gravity": g,
            "vx": round(float(vx), 4),
            "vy": round(float(vy), 4),
            "time_of_flight": round(float(t_flight), 4),
            "max_height": round(float(max_height), 4),
            "horizontal_range": round(float(horizontal_range), 4),
            "time_at_max_height": round(float(max(t_max_h, 0)), 4),
        },
        metadata={"solver": "numpy_kinematic", "time_steps": req.time_steps}
    )
