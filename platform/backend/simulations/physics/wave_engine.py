"""
PRISM – Wave Interference Simulation Engine
Uses NumPy for wave superpositions, diffraction patterns, and 2D field computations.
"""
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult


class WaveInterferenceRequest(BaseModel):
    wavelength1: float = Field(30.0, ge=5.0, le=100.0, description="Wavelength 1 in px")
    wavelength2: float = Field(30.0, ge=5.0, le=100.0, description="Wavelength 2 in px")
    source_separation: float = Field(120.0, ge=20.0, le=300.0, description="Source separation in px")
    phase_shift: float = Field(0.0, ge=0.0, le=360.0, description="Phase shift in degrees")
    grid_size: int = Field(100, ge=20, le=200, description="Grid resolution")


def compute_wave_interference(req: WaveInterferenceRequest) -> SimulationResult:
    n = req.grid_size
    x = np.linspace(-150, 150, n)
    y = np.linspace(-150, 150, n)
    X, Y = np.meshgrid(x, y)

    d = req.source_separation / 2.0
    k1 = 2 * np.pi / req.wavelength1
    k2 = 2 * np.pi / req.wavelength2
    phi = np.radians(req.phase_shift)

    # Distances to source 1 (-d, 0) and source 2 (+d, 0)
    r1 = np.sqrt((X + d) ** 2 + Y ** 2)
    r2 = np.sqrt((X - d) ** 2 + Y ** 2)

    # Superposition of cylindrical waves
    psi1 = np.cos(k1 * r1) / np.sqrt(r1 + 1.0)
    psi2 = np.cos(k2 * r2 + phi) / np.sqrt(r2 + 1.0)
    psi_total = psi1 + psi2
    intensity = psi_total ** 2

    # Cross-section slice along Y=0
    cross_section_x = x.tolist()
    cross_section_intensity = np.round(intensity[n // 2, :], 4).tolist()

    return SimulationResult(
        simulator_id="wave-interference",
        success=True,
        data={
            "grid_size": n,
            "min_intensity": float(np.min(intensity)),
            "max_intensity": float(np.max(intensity)),
            "cross_section_x": cross_section_x,
            "cross_section_intensity": cross_section_intensity,
            "source1": [-d, 0],
            "source2": [d, 0],
            "sample_matrix": np.round(intensity[::4, ::4], 3).tolist(),
        },
        metadata={"engine": "numpy_2d_superposition", "grid": f"{n}x{n}"}
    )
