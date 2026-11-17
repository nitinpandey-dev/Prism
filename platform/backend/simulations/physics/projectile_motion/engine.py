"""
PRISM – Projectile Motion Simulator
Uses NumPy and SciPy for rigorous trajectory computation.
Supports both 2D classical mechanics and 3D aerodynamic vector trajectories.
"""
import numpy as np
from scipy.integrate import solve_ivp
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from models.base import SimulationResult


class ProjectileRequest(BaseModel):
    initial_speed: float = Field(
        30.0, gt=0, le=500, description="Launch speed in m/s"
    )
    launch_angle: float = Field(
        45.0, ge=0, le=90, description="Launch angle (elevation theta) in degrees"
    )
    launch_azimuth: float = Field(
        0.0, ge=-180, le=180, description="Azimuth angle (heading phi) in degrees"
    )
    initial_height: float = Field(
        0.0, ge=-500, le=2000, description="Initial height (y0) in meters"
    )
    initial_x: float = Field(
        0.0, description="Initial X coordinate in meters"
    )
    initial_z: float = Field(
        0.0, description="Initial Z coordinate in meters"
    )
    gravity: float = Field(
        9.81, gt=0, le=50, description="Gravitational acceleration in m/s²"
    )
    air_density: float = Field(
        0.0, ge=0, le=10.0, description="Atmospheric density (0 for vacuum) in kg/m³"
    )
    drag_coefficient: float = Field(
        0.47, ge=0, le=2.0, description="Aerodynamic drag coefficient (Cd)"
    )
    cross_section_area: float = Field(
        0.04, gt=0, le=5.0, description="Frontal cross-sectional area in m²"
    )
    projectile_mass: float = Field(
        3.5, gt=0, le=500, description="Projectile mass in kg"
    )
    time_steps: int = Field(
        300, ge=50, le=5000, description="Number of time steps for trajectory"
    )
    target_x: Optional[float] = Field(None, description="Target X coordinate")
    target_y: Optional[float] = Field(None, description="Target Y elevation")
    target_z: Optional[float] = Field(None, description="Target Z coordinate")
    target_radius: float = Field(8.5, description="Target catch zone radius in meters")


def compute_projectile(req: ProjectileRequest) -> SimulationResult:
    v0 = req.initial_speed
    theta = np.radians(req.launch_angle)
    phi = np.radians(req.launch_azimuth)
    h0 = req.initial_height
    x0 = req.initial_x
    z0 = req.initial_z
    g = req.gravity
    target_elev = req.target_y if req.target_y is not None else 0.0

    # 3D Initial Velocity Components (+Y Up, +Z Forward; -X Right, +X Left)
    vx0 = - v0 * np.cos(theta) * np.sin(phi)
    vy0 = v0 * np.sin(theta)
    vz0 = v0 * np.cos(theta) * np.cos(phi)

    # ── 1. VACUUM KINEMATICS (School Mode / air_density == 0) ──
    if req.air_density <= 1e-4:
        # Time of flight: h0 + vy0*t - 0.5*g*t^2 = target_elev
        # 0.5*g*t^2 - vy0*t - (h0 - target_elev) = 0
        dy = h0 - target_elev
        discriminant = vy0**2 + 2 * g * dy
        if discriminant >= 0:
            t_flight = (vy0 + np.sqrt(discriminant)) / g
        else:
            t_flight = (2 * vy0) / g

        t = np.linspace(0, t_flight, req.time_steps)
        x = (x0 + vx0 * t).tolist()
        y = np.clip(h0 + vy0 * t - 0.5 * g * t**2, target_elev - 2.0, None).tolist()
        z = (z0 + vz0 * t).tolist()
        t_valid = t.tolist()

        t_max_h = vy0 / g
        max_height = h0 + vy0 * t_max_h - 0.5 * g * t_max_h**2 if t_max_h > 0 else h0
        solver_name = "numpy_analytical_kinematic"

    # ── 2. AERODYNAMIC DRAG (University Mode: SciPy RK45) ──
    else:
        m = req.projectile_mass
        rho = req.air_density
        cd = req.drag_coefficient
        area = req.cross_section_area
        k_drag = 0.5 * rho * cd * area

        # ODE system: state = [x, y, z, vx, vy, vz]
        def derivatives(t_val, s):
            vx, vy, vz = s[3], s[4], s[5]
            speed = np.sqrt(vx**2 + vy**2 + vz**2)
            fd = k_drag * speed
            ax = - (fd * vx) / m
            ay = - g - (fd * vy) / m
            az = - (fd * vz) / m
            return [vx, vy, vz, ax, ay, az]

        # Stop condition when reaching target elevation after apex
        def hit_ground_event(t_val, s):
            return s[1] - target_elev
        hit_ground_event.terminal = True
        hit_ground_event.direction = -1

        t_span = (0, 30.0) # max 30 seconds
        s0 = [x0, h0, z0, vx0, vy0, vz0]

        sol = solve_ivp(
            derivatives,
            t_span,
            s0,
            events=hit_ground_event,
            max_step=0.05,
            method="RK45"
        )

        t_valid = sol.t.tolist()
        x = sol.y[0].tolist()
        y = sol.y[1].tolist()
        z = sol.y[2].tolist()
        t_flight = sol.t[-1] if len(sol.t) > 0 else 0.0
        max_height = float(np.max(sol.y[1])) if len(sol.y[1]) > 0 else h0
        t_max_h = float(t_valid[np.argmax(sol.y[1])]) if len(t_valid) > 0 else 0.0
        solver_name = "scipy_rk45_drag_differential"

    # Range and impact distance
    final_x = x[-1] if x else 0.0
    final_y = y[-1] if y else 0.0
    final_z = z[-1] if z else 0.0
    horizontal_range = np.sqrt((final_x - x0)**2 + (final_z - z0)**2)

    # Target calculation
    is_hit = False
    miss_distance = None
    score = None
    if req.target_x is not None and req.target_z is not None:
        miss_distance = float(np.sqrt((final_x - req.target_x)**2 + (final_z - req.target_z)**2))
        is_hit = miss_distance <= req.target_radius
        score = int(max(0, min(100, round(100 * max(0, 1 - miss_distance / (req.target_radius * 2.0))))))

    return SimulationResult(
        simulator_id="projectile-motion",
        success=True,
        data={
            "trajectory": {
                "x": [round(float(v), 3) for v in x],
                "y": [round(float(v), 3) for v in y],
                "z": [round(float(v), 3) for v in z],
                "t": [round(float(v), 3) for v in t_valid],
            },
            "initial_speed": v0,
            "launch_angle": req.launch_angle,
            "launch_azimuth": req.launch_azimuth,
            "initial_height": h0,
            "gravity": g,
            "air_density": req.air_density,
            "vx": round(float(vx0), 4),
            "vy": round(float(vy0), 4),
            "vz": round(float(vz0), 4),
            "time_of_flight": round(float(t_flight), 4),
            "max_height": round(float(max_height), 4),
            "horizontal_range": round(float(horizontal_range), 4),
            "time_at_max_height": round(float(max(t_max_h, 0)), 4),
            "impact_point": {"x": round(final_x, 3), "y": round(final_y, 3), "z": round(final_z, 3)},
            "is_hit": is_hit,
            "miss_distance": round(miss_distance, 3) if miss_distance is not None else None,
            "score": score,
        },
        metadata={"solver": solver_name, "points_count": len(t_valid)}
    )
