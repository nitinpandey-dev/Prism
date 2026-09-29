"""
PRISM – Mathematical Function Explorer
Uses SymPy for symbolic computation + NumPy for plotting data.
"""
import numpy as np
import sympy as sp
from pydantic import BaseModel, Field
from typing import Optional, List
from models.base import SimulationResult


class FunctionRequest(BaseModel):
    expression: str = Field(
        "sin(x)", description="Mathematical expression as a string (uses x as variable)"
    )
    x_min: float = Field(-10.0, description="Left bound of domain")
    x_max: float = Field(10.0, description="Right bound of domain")
    points: int = Field(500, ge=50, le=5000, description="Number of evaluation points")
    compute_derivative: bool = Field(True, description="Compute first derivative")
    compute_integral: bool = Field(True, description="Compute indefinite integral")
    find_roots: bool = Field(True, description="Find roots in the domain")
    find_critical: bool = Field(True, description="Find critical points")


def safe_lambdify(expr, x_sym):
    """Convert sympy expression to numpy-compatible function."""
    return sp.lambdify(x_sym, expr, modules=["numpy"])


def compute_function(req: FunctionRequest) -> SimulationResult:
    x_sym = sp.Symbol("x", real=True)

    # Parse expression
    try:
        expr = sp.sympify(req.expression, locals={"x": x_sym})
    except Exception as e:
        return SimulationResult(
            simulator_id="function-explorer",
            success=False,
            error=f"Invalid expression: {str(e)}"
        )

    x_vals = np.linspace(req.x_min, req.x_max, req.points)

    # Evaluate f(x)
    try:
        f_func = safe_lambdify(expr, x_sym)
        y_raw = f_func(x_vals)
        if np.isscalar(y_raw):
            y_raw = np.full_like(x_vals, float(y_raw))
        y_vals = np.where(np.isfinite(y_raw), y_raw, np.nan)
    except Exception as e:
        return SimulationResult(
            simulator_id="function-explorer",
            success=False,
            error=f"Evaluation error: {str(e)}"
        )

    result_data: dict = {
        "x": x_vals.tolist(),
        "y": y_vals.tolist(),
        "expression_latex": sp.latex(expr),
        "expression_str": str(expr),
        "x_min": req.x_min,
        "x_max": req.x_max,
    }

    # Derivative
    if req.compute_derivative:
        try:
            deriv = sp.diff(expr, x_sym)
            d_func = safe_lambdify(deriv, x_sym)
            dy_raw = d_func(x_vals)
            if np.isscalar(dy_raw):
                dy_raw = np.full_like(x_vals, float(dy_raw))
            dy_vals = np.where(np.isfinite(dy_raw), dy_raw, np.nan)
            result_data["derivative_latex"] = sp.latex(deriv)
            result_data["derivative_str"] = str(deriv)
            result_data["dy"] = dy_vals.tolist()
        except Exception:
            result_data["derivative_latex"] = None

    # Integral
    if req.compute_integral:
        try:
            integral = sp.integrate(expr, x_sym)
            result_data["integral_latex"] = sp.latex(integral) + " + C"
            result_data["integral_str"] = str(integral) + " + C"
        except Exception:
            result_data["integral_latex"] = None

    # Roots
    if req.find_roots:
        try:
            raw_roots = sp.solve(expr, x_sym)
            roots = []
            for r in raw_roots:
                if r.is_real:
                    rv = float(r)
                    if req.x_min <= rv <= req.x_max:
                        roots.append(round(rv, 6))
            result_data["roots"] = roots[:20]  # cap at 20
        except Exception:
            result_data["roots"] = []

    # Critical points
    if req.find_critical:
        try:
            deriv = sp.diff(expr, x_sym)
            raw_crit = sp.solve(deriv, x_sym)
            crits = []
            for c in raw_crit:
                if c.is_real:
                    cv = float(c)
                    if req.x_min <= cv <= req.x_max:
                        fv = float(expr.subs(x_sym, cv).evalf())
                        if np.isfinite(fv):
                            crits.append({"x": round(cv, 6), "y": round(fv, 6)})
            result_data["critical_points"] = crits[:20]
        except Exception:
            result_data["critical_points"] = []

    return SimulationResult(
        simulator_id="function-explorer",
        success=True,
        data=result_data,
        metadata={"solver": "sympy_numpy", "points": req.points}
    )
