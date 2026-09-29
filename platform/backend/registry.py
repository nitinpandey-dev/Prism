"""
PRISM Simulator Registry (Backend)
===================================
Central registry mapping simulator IDs to their metadata and computation modules.

To add a new simulator:
1. Create a module in simulations/<subject>/<simulator_id>/
2. Add a SimulatorEntry to REGISTRY below
3. Register its router in the routers list

No other files need to be modified.
"""
from models.base import (
    SimulatorMeta, SimulatorStatus, SubjectEnum,
    DifficultyEnum, VisualizationTypeEnum
)
from typing import Dict, Optional

REGISTRY: Dict[str, SimulatorMeta] = {
    # ─── CHEMISTRY ────────────────────────────────────────────────────────────
    "solid-state": SimulatorMeta(
        id="solid-state",
        title="Crystal Lattice Explorer",
        description=(
            "Visualize SC, BCC, and FCC cubic crystal structures in 3D. "
            "Explore packing efficiency, coordination numbers, and unit cell geometry."
        ),
        subject=SubjectEnum.CHEMISTRY,
        topic="Solid State Chemistry",
        difficulty=DifficultyEnum.INTERMEDIATE,
        route="/simulations/solid-state",
        status=SimulatorStatus.AVAILABLE,
        backend_endpoint="/api/simulations/solid-state",
        learning_objectives=[
            "Understand the three cubic crystal systems (SC, BCC, FCC)",
            "Calculate atomic packing efficiency",
            "Determine coordination numbers",
            "Relate lattice parameters to physical properties",
        ],
        tags=["crystal", "lattice", "3d", "solid-state", "packing"],
        visualization_type=VisualizationTypeEnum.THREE_D,
        thumbnail_color="linear-gradient(135deg, #6366f1, #8b5cf6)",
        icon="🔬",
    ),
    "molecular-geometry": SimulatorMeta(
        id="molecular-geometry",
        title="Molecular Geometry",
        description="Explore VSEPR theory and 3D molecular shapes.",
        subject=SubjectEnum.CHEMISTRY,
        topic="Molecular Geometry",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/molecular-geometry",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Apply VSEPR theory to predict molecular shapes",
            "Understand bond angles and molecular polarity",
        ],
        tags=["VSEPR", "molecular", "geometry", "bonding"],
        visualization_type=VisualizationTypeEnum.THREE_D,
        thumbnail_color="linear-gradient(135deg, #a78bfa, #7c3aed)",
        icon="⚗️",
    ),
    "atomic-orbitals": SimulatorMeta(
        id="atomic-orbitals",
        title="Atomic Orbitals",
        description="Visualize electron probability densities for s, p, d orbitals.",
        subject=SubjectEnum.CHEMISTRY,
        topic="Atomic Structure",
        difficulty=DifficultyEnum.ADVANCED,
        route="/simulations/atomic-orbitals",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand orbital shapes and quantum numbers",
            "Interpret electron probability densities",
        ],
        tags=["orbitals", "quantum", "electron", "wavefunction"],
        visualization_type=VisualizationTypeEnum.THREE_D,
        thumbnail_color="linear-gradient(135deg, #3b82f6, #6366f1)",
        icon="⚛️",
    ),
    "reaction-kinetics": SimulatorMeta(
        id="reaction-kinetics",
        title="Reaction Kinetics",
        description="Simulate concentration vs. time for first and second order reactions.",
        subject=SubjectEnum.CHEMISTRY,
        topic="Chemical Kinetics",
        difficulty=DifficultyEnum.INTERMEDIATE,
        route="/simulations/reaction-kinetics",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand reaction rate laws",
            "Differentiate zero, first, and second order kinetics",
        ],
        tags=["kinetics", "reaction", "rate", "concentration"],
        visualization_type=VisualizationTypeEnum.GRAPH,
        thumbnail_color="linear-gradient(135deg, #10b981, #059669)",
        icon="🧪",
    ),

    # ─── PHYSICS ──────────────────────────────────────────────────────────────
    "projectile-motion": SimulatorMeta(
        id="projectile-motion",
        title="Projectile Motion",
        description=(
            "Simulate 2D projectile trajectories with adjustable launch angle, "
            "speed, and gravity. Calculates range, max height, and time of flight."
        ),
        subject=SubjectEnum.PHYSICS,
        topic="Classical Mechanics",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/projectile-motion",
        status=SimulatorStatus.AVAILABLE,
        backend_endpoint="/api/simulations/projectile-motion",
        learning_objectives=[
            "Decompose motion into horizontal and vertical components",
            "Apply kinematic equations to projectile problems",
            "Understand the effect of launch angle on range",
        ],
        tags=["projectile", "kinematics", "trajectory", "mechanics"],
        visualization_type=VisualizationTypeEnum.TWO_D,
        thumbnail_color="linear-gradient(135deg, #f59e0b, #ef4444)",
        icon="🚀",
    ),
    "simple-harmonic-motion": SimulatorMeta(
        id="simple-harmonic-motion",
        title="Simple Harmonic Motion",
        description="Explore spring-mass systems, pendulums, and oscillation dynamics.",
        subject=SubjectEnum.PHYSICS,
        topic="Oscillations & Waves",
        difficulty=DifficultyEnum.INTERMEDIATE,
        route="/simulations/simple-harmonic-motion",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand Hooke's Law and restoring forces",
            "Calculate period, frequency, and amplitude",
        ],
        tags=["oscillation", "spring", "pendulum", "SHM"],
        visualization_type=VisualizationTypeEnum.ANIMATION,
        thumbnail_color="linear-gradient(135deg, #ec4899, #f43f5e)",
        icon="🌊",
    ),
    "wave-interference": SimulatorMeta(
        id="wave-interference",
        title="Wave Interference",
        description="Visualize constructive and destructive interference patterns.",
        subject=SubjectEnum.PHYSICS,
        topic="Waves & Optics",
        difficulty=DifficultyEnum.INTERMEDIATE,
        route="/simulations/wave-interference",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand the superposition principle",
            "Distinguish constructive from destructive interference",
        ],
        tags=["waves", "interference", "superposition", "optics"],
        visualization_type=VisualizationTypeEnum.TWO_D,
        thumbnail_color="linear-gradient(135deg, #06b6d4, #0891b2)",
        icon="〰️",
    ),
    "electric-fields": SimulatorMeta(
        id="electric-fields",
        title="Electric Fields",
        description="Visualize electric field lines and equipotential surfaces for point charges.",
        subject=SubjectEnum.PHYSICS,
        topic="Electrostatics",
        difficulty=DifficultyEnum.ADVANCED,
        route="/simulations/electric-fields",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Apply Coulomb's Law",
            "Understand electric field superposition",
        ],
        tags=["electric", "field", "coulomb", "electrostatics"],
        visualization_type=VisualizationTypeEnum.TWO_D,
        thumbnail_color="linear-gradient(135deg, #f59e0b, #f97316)",
        icon="⚡",
    ),

    # ─── MATHEMATICS ──────────────────────────────────────────────────────────
    "function-explorer": SimulatorMeta(
        id="function-explorer",
        title="Mathematical Function Explorer",
        description=(
            "Plot and analyze any mathematical function in real-time. "
            "Supports derivatives, integrals, roots, and critical points via SymPy."
        ),
        subject=SubjectEnum.MATHEMATICS,
        topic="Functions & Calculus",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/function-explorer",
        status=SimulatorStatus.AVAILABLE,
        backend_endpoint="/api/simulations/function-explorer",
        learning_objectives=[
            "Visualize function behavior graphically",
            "Compute derivatives and integrals symbolically",
            "Identify roots, maxima, and minima",
        ],
        tags=["function", "graph", "calculus", "derivative", "integral"],
        visualization_type=VisualizationTypeEnum.GRAPH,
        thumbnail_color="linear-gradient(135deg, #22c55e, #16a34a)",
        icon="📈",
    ),
    "vector-fields": SimulatorMeta(
        id="vector-fields",
        title="Vector Fields",
        description="Visualize 2D vector fields and stream lines for various functions.",
        subject=SubjectEnum.MATHEMATICS,
        topic="Multivariable Calculus",
        difficulty=DifficultyEnum.ADVANCED,
        route="/simulations/vector-fields",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand divergence and curl",
            "Visualize gradient fields",
        ],
        tags=["vector", "field", "gradient", "curl", "divergence"],
        visualization_type=VisualizationTypeEnum.TWO_D,
        thumbnail_color="linear-gradient(135deg, #14b8a6, #0d9488)",
        icon="🧭",
    ),
    "differential-equations": SimulatorMeta(
        id="differential-equations",
        title="Differential Equations",
        description="Plot slope fields and numerical solutions to ODEs.",
        subject=SubjectEnum.MATHEMATICS,
        topic="Differential Equations",
        difficulty=DifficultyEnum.ADVANCED,
        route="/simulations/differential-equations",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand slope fields as a visual tool",
            "Apply Euler and RK4 methods numerically",
        ],
        tags=["ODE", "differential", "slope-field", "numerical"],
        visualization_type=VisualizationTypeEnum.GRAPH,
        thumbnail_color="linear-gradient(135deg, #a855f7, #9333ea)",
        icon="∫",
    ),

    # ─── BIOLOGY ──────────────────────────────────────────────────────────────
    "population-growth": SimulatorMeta(
        id="population-growth",
        title="Population Growth Models",
        description="Compare logistic and exponential population growth models.",
        subject=SubjectEnum.BIOLOGY,
        topic="Ecology & Population Dynamics",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/population-growth",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Differentiate exponential from logistic growth",
            "Understand carrying capacity",
        ],
        tags=["population", "ecology", "logistic", "growth"],
        visualization_type=VisualizationTypeEnum.GRAPH,
        thumbnail_color="linear-gradient(135deg, #84cc16, #65a30d)",
        icon="🌿",
    ),
    "dna-structure": SimulatorMeta(
        id="dna-structure",
        title="DNA Double Helix",
        description="Interactive 3D visualization of the DNA double helix structure.",
        subject=SubjectEnum.BIOLOGY,
        topic="Molecular Biology",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/dna-structure",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand base pairing rules",
            "Visualize the antiparallel double helix",
        ],
        tags=["DNA", "helix", "nucleotide", "molecular"],
        visualization_type=VisualizationTypeEnum.THREE_D,
        thumbnail_color="linear-gradient(135deg, #f43f5e, #e11d48)",
        icon="🧬",
    ),

    # ─── COMPUTER SCIENCE ─────────────────────────────────────────────────────
    "sorting-algorithms": SimulatorMeta(
        id="sorting-algorithms",
        title="Sorting Algorithms",
        description="Animate and compare bubble, merge, quick, and heap sort algorithms.",
        subject=SubjectEnum.COMPUTER_SCIENCE,
        topic="Algorithms & Data Structures",
        difficulty=DifficultyEnum.BEGINNER,
        route="/simulations/sorting-algorithms",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand time complexity of sorting algorithms",
            "Compare algorithm efficiency visually",
        ],
        tags=["sorting", "algorithms", "complexity", "animation"],
        visualization_type=VisualizationTypeEnum.ANIMATION,
        thumbnail_color="linear-gradient(135deg, #f97316, #ea580c)",
        icon="📊",
    ),
    "graph-algorithms": SimulatorMeta(
        id="graph-algorithms",
        title="Graph Algorithms",
        description="Visualize BFS, DFS, Dijkstra, and A* on interactive graphs.",
        subject=SubjectEnum.COMPUTER_SCIENCE,
        topic="Graph Theory",
        difficulty=DifficultyEnum.INTERMEDIATE,
        route="/simulations/graph-algorithms",
        status=SimulatorStatus.COMING_SOON,
        backend_endpoint=None,
        learning_objectives=[
            "Understand traversal strategies (BFS vs DFS)",
            "Apply shortest path algorithms",
        ],
        tags=["graph", "BFS", "DFS", "Dijkstra", "pathfinding"],
        visualization_type=VisualizationTypeEnum.DIAGRAM,
        thumbnail_color="linear-gradient(135deg, #0ea5e9, #0284c7)",
        icon="🕸️",
    ),
}


def get_all() -> list[SimulatorMeta]:
    return list(REGISTRY.values())


def get_by_id(simulator_id: str) -> Optional[SimulatorMeta]:
    return REGISTRY.get(simulator_id)


def get_by_subject(subject: str) -> list[SimulatorMeta]:
    return [s for s in REGISTRY.values() if s.subject.value == subject]


def get_available() -> list[SimulatorMeta]:
    return [s for s in REGISTRY.values() if s.status == SimulatorStatus.AVAILABLE]
