"""
PRISM – Differential Equations & Slope Fields Engine
Uses SciPy solve_ivp and NumPy for numerical ODE solvers and direction field generation.
"""
import numpy as np
from scipy.integrate import solve_ivp
from pydantic import BaseModel, Field
from models.base import SimulationResult


class ODERequest(BaseModel):
    equation_type: str = Field("exponential", description="exponential, logistic, oscillator, linear")
    param_a: float = Field(0.5, description="Parameter a")
    param_b: float = Field(1.0, description="Parameter b / carrying capacity")
    initial_y: float = Field(1.0, description="Initial condition y(0)")
    x_min: float = Field(-5.0, description="x min")
    x_max: float = Field(5.0, description="x max")
    grid_size: int = Field(16, ge=8, le=30, description="Grid points per axis for slope field")


def compute_ode(req: ODERequest) -> SimulationResult:
    def dydx(x, y):
        val_y = y[0]
        if req.equation_type == "logistic":
            return [req.param_a * val_y * (1.0 - val_y / max(0.01, req.param_b))]
        elif req.equation_type == "oscillator":
            return [-req.param_a * x]
        elif req.equation_type == "linear":
            return [req.param_a * x + req.param_b * val_y]
        else:  # exponential
            return [req.param_a * val_y]

    # Slope field grid
    xs = np.linspace(req.x_min, req.x_max, req.grid_size)
    ys = np.linspace(-5.0, 5.0, req.grid_size)
    grid_vectors = []

    for x in xs:
        for y in ys:
            slope = float(dydx(x, [y])[0])
            mag = np.sqrt(1.0 + slope**2)
            grid_vectors.append({
                "x": round(float(x), 2),
                "y": round(float(y), 2),
                "dx": round(float(1.0 / mag), 3),
                "dy": round(float(slope / mag), 3),
                "slope": round(slope, 3),
            })

    # Numerical solution curve via SciPy
    t_eval = np.linspace(max(0.0, req.x_min), req.x_max, 100)
    sol = solve_ivp(dydx, (max(0.0, req.x_min), req.x_max), [req.initial_y], t_eval=t_eval, method="RK45")

    solution_curve = [
        {"x": round(float(t_eval[i]), 3), "y": round(float(sol.y[0][i]), 3)}
        for i in range(len(t_eval)) if np.isfinite(sol.y[0][i])
    ]

    return SimulationResult(
        simulator_id="differential-equations",
        success=True,
        data={
            "equation_type": req.equation_type,
            "slope_field": grid_vectors,
            "solution_curve": solution_curve,
        },
        metadata={"solver": "scipy.integrate.solve_ivp_RK45"}
    )
