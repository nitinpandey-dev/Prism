"""
PRISM – Reaction Kinetics Engine
Uses SciPy numerical ODE integration and Arrhenius temperature scaling for chemical kinetics.
"""
import numpy as np
from scipy.integrate import solve_ivp
from pydantic import BaseModel, Field
from models.base import SimulationResult


class KineticsRequest(BaseModel):
    order: int = Field(1, ge=0, le=2, description="Reaction order: 0, 1, or 2")
    rate_constant_k: float = Field(0.08, gt=0, le=5.0, description="Base rate constant k")
    initial_conc_a: float = Field(1.0, gt=0, le=10.0, description="Initial [A] in M")
    temperature_k: float = Field(298.15, ge=200.0, le=600.0, description="Temperature in Kelvin")
    activation_energy: float = Field(5000.0, ge=0.0, le=100000.0, description="Activation energy Ea in J/mol")
    time_max: float = Field(60.0, gt=1.0, le=300.0, description="Max simulation time in seconds")


def compute_kinetics(req: KineticsRequest) -> SimulationResult:
    r_const = 8.314  # J/(mol*K)
    # Arrhenius equation temperature scaling
    temp_factor = np.exp((req.activation_energy / r_const) * (1.0 / 298.15 - 1.0 / req.temperature_k))
    k_eff = req.rate_constant_k * temp_factor

    def rate_law(t, y):
        a = max(0.0, y[0])
        if req.order == 0:
            rate = k_eff if a > 0 else 0.0
        elif req.order == 1:
            rate = k_eff * a
        else:  # order == 2
            rate = k_eff * (a ** 2)
        return [-rate]

    t_eval = np.linspace(0, req.time_max, 100)
    sol = solve_ivp(rate_law, (0, req.time_max), [req.initial_conc_a], t_eval=t_eval, method="RK45")

    conc_a = np.maximum(0.0, sol.y[0])
    conc_b = req.initial_conc_a - conc_a

    # Half life calculation
    if req.order == 0:
        half_life = req.initial_conc_a / (2.0 * k_eff)
    elif req.order == 1:
        half_life = np.log(2.0) / k_eff
    else:
        half_life = 1.0 / (k_eff * req.initial_conc_a)

    points = [
        {
            "time": round(float(t_eval[i]), 2),
            "[A] (Reactant)": round(float(conc_a[i]), 4),
            "[B] (Product)": round(float(conc_b[i]), 4),
        }
        for i in range(len(t_eval))
    ]

    return SimulationResult(
        simulator_id="reaction-kinetics",
        success=True,
        data={
            "order": req.order,
            "k_effective": round(float(k_eff), 5),
            "half_life": round(float(half_life), 2),
            "temperature_factor": round(float(temp_factor), 3),
            "points": points,
        },
        metadata={"solver": "scipy.integrate.solve_ivp_RK45", "points_count": len(t_eval)}
    )
