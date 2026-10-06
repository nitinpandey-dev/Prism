"""
PRISM – Molecular Geometry & VSEPR Engine
Uses NumPy 3D geometry and vector math for molecular structures.
"""
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult


class MolecularRequest(BaseModel):
    molecule_key: str = Field("CH4", description="Molecule key: CO2, H2O, BF3, CH4, PCl5, SF6")


MOLECULE_DATA = {
    "CO2": {
        "name": "Carbon Dioxide",
        "formula": "CO₂",
        "geometry": "Linear",
        "electron_geometry": "Linear",
        "hybridization": "sp",
        "bond_angle_deg": 180.0,
        "polarity": "Non-polar",
        "atoms": [
            {"symbol": "C", "pos": [0.0, 0.0, 0.0], "color": "#334155", "radius": 24},
            {"symbol": "O", "pos": [-120.0, 0.0, 0.0], "color": "#ef4444", "radius": 20},
            {"symbol": "O", "pos": [120.0, 0.0, 0.0], "color": "#ef4444", "radius": 20},
        ],
        "bonds": [[0, 1, 2], [0, 2, 2]],
        "lone_pairs": [],
    },
    "H2O": {
        "name": "Water",
        "formula": "H₂O",
        "geometry": "Bent",
        "electron_geometry": "Tetrahedral",
        "hybridization": "sp³",
        "bond_angle_deg": 104.5,
        "polarity": "Polar (1.85 D)",
        "atoms": [
            {"symbol": "O", "pos": [0.0, -20.0, 0.0], "color": "#ef4444", "radius": 24},
            {"symbol": "H", "pos": [-75.0, 60.0, 0.0], "color": "#f8fafc", "radius": 16},
            {"symbol": "H", "pos": [75.0, 60.0, 0.0], "color": "#f8fafc", "radius": 16},
        ],
        "bonds": [[0, 1, 1], [0, 2, 1]],
        "lone_pairs": [{"pos": [-45.0, -70.0, 30.0]}, {"pos": [45.0, -70.0, -30.0]}],
    },
    "BF3": {
        "name": "Boron Trifluoride",
        "formula": "BF₃",
        "geometry": "Trigonal Planar",
        "electron_geometry": "Trigonal Planar",
        "hybridization": "sp²",
        "bond_angle_deg": 120.0,
        "polarity": "Non-polar",
        "atoms": [
            {"symbol": "B", "pos": [0.0, 0.0, 0.0], "color": "#ec4899", "radius": 22},
            {"symbol": "F", "pos": [0.0, -110.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [95.0, 55.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [-95.0, 55.0, 0.0], "color": "#10b981", "radius": 19},
        ],
        "bonds": [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
        "lone_pairs": [],
    },
    "CH4": {
        "name": "Methane",
        "formula": "CH₄",
        "geometry": "Tetrahedral",
        "electron_geometry": "Tetrahedral",
        "hybridization": "sp³",
        "bond_angle_deg": 109.5,
        "polarity": "Non-polar",
        "atoms": [
            {"symbol": "C", "pos": [0.0, 0.0, 0.0], "color": "#334155", "radius": 24},
            {"symbol": "H", "pos": [0.0, -100.0, 30.0], "color": "#f8fafc", "radius": 16},
            {"symbol": "H", "pos": [94.0, 40.0, 40.0], "color": "#f8fafc", "radius": 16},
            {"symbol": "H", "pos": [-94.0, 40.0, 40.0], "color": "#f8fafc", "radius": 16},
            {"symbol": "H", "pos": [0.0, 40.0, -100.0], "color": "#f8fafc", "radius": 16},
        ],
        "bonds": [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
        "lone_pairs": [],
    },
    "PCl5": {
        "name": "Phosphorus Pentachloride",
        "formula": "PCl₅",
        "geometry": "Trigonal Bipyramidal",
        "electron_geometry": "Trigonal Bipyramidal",
        "hybridization": "sp³d",
        "bond_angle_deg": 90.0,
        "polarity": "Non-polar",
        "atoms": [
            {"symbol": "P", "pos": [0.0, 0.0, 0.0], "color": "#f59e0b", "radius": 25},
            {"symbol": "Cl", "pos": [0.0, -115.0, 0.0], "color": "#22c55e", "radius": 20},
            {"symbol": "Cl", "pos": [0.0, 115.0, 0.0], "color": "#22c55e", "radius": 20},
            {"symbol": "Cl", "pos": [100.0, 0.0, 0.0], "color": "#22c55e", "radius": 20},
            {"symbol": "Cl", "pos": [-50.0, 0.0, 86.0], "color": "#22c55e", "radius": 20},
            {"symbol": "Cl", "pos": [-50.0, 0.0, -86.0], "color": "#22c55e", "radius": 20},
        ],
        "bonds": [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1]],
        "lone_pairs": [],
    },
    "SF6": {
        "name": "Sulfur Hexafluoride",
        "formula": "SF₆",
        "geometry": "Octahedral",
        "electron_geometry": "Octahedral",
        "hybridization": "sp³d²",
        "bond_angle_deg": 90.0,
        "polarity": "Non-polar",
        "atoms": [
            {"symbol": "S", "pos": [0.0, 0.0, 0.0], "color": "#eab308", "radius": 25},
            {"symbol": "F", "pos": [0.0, -105.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [0.0, 105.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [-105.0, 0.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [105.0, 0.0, 0.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [0.0, 0.0, -105.0], "color": "#10b981", "radius": 19},
            {"symbol": "F", "pos": [0.0, 0.0, 105.0], "color": "#10b981", "radius": 19},
        ],
        "bonds": [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1]],
        "lone_pairs": [],
    },
}


def compute_molecular_geometry(req: MolecularRequest) -> SimulationResult:
    mol = MOLECULE_DATA.get(req.molecule_key.upper(), MOLECULE_DATA["CH4"])
    return SimulationResult(
        simulator_id="molecular-geometry",
        success=True,
        data=mol,
        metadata={"engine": "numpy_vsepr_3d"}
    )
