"""
PRISM – Solid State Chemistry Simulator
Computes atomic positions, packing efficiency, and geometry for SC, BCC, FCC.
"""
import numpy as np
from pydantic import BaseModel, Field
from typing import Literal, List
from models.base import SimulationResult


class CrystalRequest(BaseModel):
    structure: Literal["SC", "BCC", "FCC"] = Field(
        "FCC", description="Crystal structure type"
    )
    lattice_constant: float = Field(
        4.05, gt=0, description="Lattice constant in Ångströms (default: Aluminum FCC)"
    )
    supercell: int = Field(
        2, ge=1, le=4, description="Number of unit cells along each axis"
    )


class AtomPosition(BaseModel):
    x: float
    y: float
    z: float
    role: str  # "corner", "body_center", "face_center"


STRUCTURE_DATA = {
    "SC": {
        "basis": [(0.0, 0.0, 0.0)],
        "roles": ["corner"],
        "atoms_per_cell": 1,
        "coordination_number": 6,
        "packing_efficiency": 0.5236,  # π/6
        "radius_ratio": 0.5,           # r = a/2
    },
    "BCC": {
        "basis": [(0.0, 0.0, 0.0), (0.5, 0.5, 0.5)],
        "roles": ["corner", "body_center"],
        "atoms_per_cell": 2,
        "coordination_number": 8,
        "packing_efficiency": 0.6802,  # π√3/8
        "radius_ratio": 0.4330,        # r = a√3/4
    },
    "FCC": {
        "basis": [
            (0.0, 0.0, 0.0),
            (0.5, 0.5, 0.0), (0.5, 0.0, 0.5), (0.0, 0.5, 0.5)
        ],
        "roles": ["corner", "face_center", "face_center", "face_center"],
        "atoms_per_cell": 4,
        "coordination_number": 12,
        "packing_efficiency": 0.7405,  # π/(3√2)
        "radius_ratio": 0.3536,        # r = a/(2√2)
    },
}


def compute_crystal(req: CrystalRequest) -> SimulationResult:
    data = STRUCTURE_DATA[req.structure]
    a = req.lattice_constant
    n = req.supercell

    atoms: List[dict] = []
    seen = set()

    for ix in range(n):
        for iy in range(n):
            for iz in range(n):
                for (fx, fy, fz), role in zip(data["basis"], data["roles"]):
                    x = round((ix + fx) * a, 6)
                    y = round((iy + fy) * a, 6)
                    z = round((iz + fz) * a, 6)
                    key = (x, y, z)
                    if key not in seen:
                        seen.add(key)
                        atoms.append({"x": x, "y": y, "z": z, "role": role})

    r = data["radius_ratio"] * a
    packing = data["packing_efficiency"]
    cn = data["coordination_number"]
    z_count = data["atoms_per_cell"]

    return SimulationResult(
        simulator_id="solid-state",
        success=True,
        data={
            "atoms": atoms,
            "structure": req.structure,
            "lattice_constant": a,
            "supercell": n,
            "atom_radius": r,
            "atoms_per_unit_cell": z_count,
            "coordination_number": cn,
            "packing_efficiency": packing,
            "packing_efficiency_percent": round(packing * 100, 2),
            "void_fraction": round((1 - packing) * 100, 2),
            "unit_cell_volume": round(a ** 3, 4),
            "total_atoms_rendered": len(atoms),
        },
        metadata={
            "structure_type": req.structure,
            "supercell_size": f"{n}×{n}×{n}",
        }
    )
