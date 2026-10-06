"""
PRISM API Routers for Physics, Chemistry, Mathematics, Biology, and Computer Science
"""
from fastapi import APIRouter, HTTPException
from models.base import SimulationResult

# Physics
from simulations.physics.wave_engine import WaveInterferenceRequest, compute_wave_interference
from simulations.physics.electric_field_engine import ElectricFieldRequest, compute_electric_field

# Chemistry
from simulations.chemistry.kinetics_engine import KineticsRequest, compute_kinetics
from simulations.chemistry.orbitals_engine import OrbitalRequest, compute_atomic_orbital
from simulations.chemistry.molecular_engine import MolecularRequest, compute_molecular_geometry

# Mathematics
from simulations.mathematics.ode_engine import ODERequest, compute_ode
from simulations.mathematics.vector_field_engine import VectorFieldRequest, compute_vector_field

# Biology & CS
from simulations.biology.population_engine import PopulationRequest, compute_population
from simulations.cs.sorting_engine import SortingRequest, compute_sorting

# Routers
wave_router = APIRouter(prefix="/api/simulations/wave-interference", tags=["Physics"])
@wave_router.post("", response_model=SimulationResult, include_in_schema=False)
@wave_router.post("/", response_model=SimulationResult)
def run_wave(req: WaveInterferenceRequest):
    return compute_wave_interference(req)

electric_router = APIRouter(prefix="/api/simulations/electric-fields", tags=["Physics"])
@electric_router.post("", response_model=SimulationResult, include_in_schema=False)
@electric_router.post("/", response_model=SimulationResult)
def run_electric(req: ElectricFieldRequest):
    return compute_electric_field(req)

kinetics_router = APIRouter(prefix="/api/simulations/reaction-kinetics", tags=["Chemistry"])
@kinetics_router.post("", response_model=SimulationResult, include_in_schema=False)
@kinetics_router.post("/", response_model=SimulationResult)
def run_kinetics(req: KineticsRequest):
    return compute_kinetics(req)

orbitals_router = APIRouter(prefix="/api/simulations/atomic-orbitals", tags=["Chemistry"])
@orbitals_router.post("", response_model=SimulationResult, include_in_schema=False)
@orbitals_router.post("/", response_model=SimulationResult)
def run_orbitals(req: OrbitalRequest):
    return compute_atomic_orbital(req)

molecular_router = APIRouter(prefix="/api/simulations/molecular-geometry", tags=["Chemistry"])
@molecular_router.post("", response_model=SimulationResult, include_in_schema=False)
@molecular_router.post("/", response_model=SimulationResult)
def run_molecular(req: MolecularRequest):
    return compute_molecular_geometry(req)

ode_router = APIRouter(prefix="/api/simulations/differential-equations", tags=["Mathematics"])
@ode_router.post("", response_model=SimulationResult, include_in_schema=False)
@ode_router.post("/", response_model=SimulationResult)
def run_ode(req: ODERequest):
    return compute_ode(req)

vector_field_router = APIRouter(prefix="/api/simulations/vector-fields", tags=["Mathematics"])
@vector_field_router.post("", response_model=SimulationResult, include_in_schema=False)
@vector_field_router.post("/", response_model=SimulationResult)
def run_vector_field(req: VectorFieldRequest):
    return compute_vector_field(req)

population_router = APIRouter(prefix="/api/simulations/population-growth", tags=["Biology"])
@population_router.post("", response_model=SimulationResult, include_in_schema=False)
@population_router.post("/", response_model=SimulationResult)
def run_population(req: PopulationRequest):
    return compute_population(req)

sorting_router = APIRouter(prefix="/api/simulations/sorting-algorithms", tags=["Computer Science"])
@sorting_router.post("", response_model=SimulationResult, include_in_schema=False)
@sorting_router.post("/", response_model=SimulationResult)
def run_sorting(req: SortingRequest):
    return compute_sorting(req)
