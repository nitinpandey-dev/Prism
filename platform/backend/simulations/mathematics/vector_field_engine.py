"""
PRISM – Vector Fields & Multivariable Calculus Engine
Uses NumPy to compute vector fields, divergence, and curl.
"""
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult


class VectorFieldRequest(BaseModel):
    field_type: str = Field("vortex", description="vortex, source, sink, saddle, uniform")
    grid_size: int = Field(16, ge=8, le=32, description="Grid resolution")
    strength: float = Field(1.0, ge=0.1, le=5.0, description="Field strength scalar")


def compute_vector_field(req: VectorFieldRequest) -> SimulationResult:
    n = req.grid_size
    x = np.linspace(-4.0, 4.0, n)
    y = np.linspace(-4.0, 4.0, n)
    X, Y = np.meshgrid(x, y)

    s = req.strength
    if req.field_type == "vortex":
        U = -s * Y
        V = s * X
        div_val = 0.0
        curl_val = 2.0 * s
    elif req.field_type == "source":
        U = s * X
        V = s * Y
        div_val = 2.0 * s
        curl_val = 0.0
    elif req.field_type == "sink":
        U = -s * X
        V = -s * Y
        div_val = -2.0 * s
        curl_val = 0.0
    elif req.field_type == "saddle":
        U = s * X
        V = -s * Y
        div_val = 0.0
        curl_val = 0.0
    else:  # uniform
        U = s * np.ones_like(X)
        V = np.zeros_like(Y)
        div_val = 0.0
        curl_val = 0.0

    mag = np.sqrt(U**2 + V**2)
    mag_safe = np.maximum(mag, 1e-6)
    U_norm = U / mag_safe
    V_norm = V / mag_safe

    vectors = []
    for i in range(n):
        for j in range(n):
            vectors.append({
                "x": round(float(X[i, j]), 2),
                "y": round(float(Y[i, j]), 2),
                "u": round(float(U_norm[i, j]), 3),
                "v": round(float(V_norm[i, j]), 3),
                "magnitude": round(float(mag[i, j]), 3),
            })

    return SimulationResult(
        simulator_id="vector-fields",
        success=True,
        data={
            "field_type": req.field_type,
            "vectors": vectors,
            "divergence": round(float(div_val), 2),
            "curl_z": round(float(curl_val), 2),
        },
        metadata={"engine": "numpy_multivariable_calculus"}
    )
