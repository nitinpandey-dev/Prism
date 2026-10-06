"""
PRISM – Population Growth & Ecology Engine
Uses SciPy solve_ivp for exponential, logistic, and Lotka-Volterra predator-prey dynamics.
"""
import numpy as np
from scipy.integrate import solve_ivp
from pydantic import BaseModel, Field
from models.base import SimulationResult


class PopulationRequest(BaseModel):
    model_type: str = Field("predator_prey", description="logistic, exponential, predator_prey")
    r_growth: float = Field(0.5, gt=0, le=2.0, description="Growth rate r")
    carrying_capacity: float = Field(500.0, gt=10.0, le=2000.0, description="Carrying capacity K")
    initial_n: float = Field(50.0, gt=1.0, le=500.0, description="Initial Prey/Population N0")
    initial_predator: float = Field(20.0, ge=0.0, le=200.0, description="Initial Predator P0")
    time_max: float = Field(50.0, gt=5.0, le=200.0, description="Max time in days")


def compute_population(req: PopulationRequest) -> SimulationResult:
    if req.model_type == "predator_prey":
        # Lotka-Volterra: dN/dt = alpha*N - beta*N*P, dP/dt = delta*N*P - gamma*P
        alpha = req.r_growth
        beta = 0.02
        delta = 0.01
        gamma = 0.3

        def system(t, state):
            N, P = state
            dN = alpha * N - beta * N * P
            dP = delta * N * P - gamma * P
            return [dN, dP]

        t_eval = np.linspace(0, req.time_max, 150)
        sol = solve_ivp(system, (0, req.time_max), [req.initial_n, req.initial_predator], t_eval=t_eval, method="RK45")

        points = [
            {
                "time": round(float(t_eval[i]), 1),
                "Prey (N)": max(0, round(float(sol.y[0][i]), 1)),
                "Predator (P)": max(0, round(float(sol.y[1][i]), 1)),
            }
            for i in range(len(t_eval))
        ]
    elif req.model_type == "logistic":
        t_eval = np.linspace(0, req.time_max, 100)
        K = req.carrying_capacity
        N0 = req.initial_n
        r = req.r_growth
        # Analytical logistic formula N(t) = K / (1 + ((K - N0)/N0) * exp(-r*t))
        N_t = K / (1.0 + ((K - N0) / N0) * np.exp(-r * t_eval))
        points = [
            {
                "time": round(float(t_eval[i]), 1),
                "Population (N)": round(float(N_t[i]), 1),
                "Carrying Capacity (K)": K,
            }
            for i in range(len(t_eval))
        ]
    else:  # exponential
        t_eval = np.linspace(0, min(20.0, req.time_max), 100)
        N_t = req.initial_n * np.exp(req.r_growth * t_eval)
        points = [
            {
                "time": round(float(t_eval[i]), 1),
                "Population (N)": round(float(N_t[i]), 1),
            }
            for i in range(len(t_eval))
        ]

    return SimulationResult(
        simulator_id="population-growth",
        success=True,
        data={
            "model_type": req.model_type,
            "points": points,
        },
        metadata={"solver": "scipy.integrate.solve_ivp_lotka_volterra"}
    )
