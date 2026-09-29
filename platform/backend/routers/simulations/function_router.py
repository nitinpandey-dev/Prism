"""
PRISM API Router – Mathematical Function Explorer
"""
from fastapi import APIRouter, HTTPException
from simulations.mathematics.function_explorer.engine import FunctionRequest, compute_function
from models.base import SimulationResult

router = APIRouter(prefix="/api/simulations/function-explorer", tags=["Mathematics"])


@router.post("/", response_model=SimulationResult)
def run_function(req: FunctionRequest):
    """Evaluate a mathematical function and compute analysis."""
    try:
        return compute_function(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/examples")
def get_example_functions():
    """Return a list of example function expressions."""
    return {
        "examples": [
            {"label": "Sine wave", "expression": "sin(x)"},
            {"label": "Quadratic", "expression": "x**2 - 4"},
            {"label": "Cubic", "expression": "x**3 - 3*x"},
            {"label": "Exponential", "expression": "exp(-x**2/2)"},
            {"label": "Logarithm", "expression": "log(x)"},
            {"label": "Rational", "expression": "1/(x**2 + 1)"},
            {"label": "Sine + Cosine", "expression": "sin(x) + cos(2*x)"},
            {"label": "Damped oscillation", "expression": "exp(-x/3)*sin(2*x)"},
        ]
    }
