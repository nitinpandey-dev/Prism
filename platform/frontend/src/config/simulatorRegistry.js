/**
 * PRISM Simulator Registry (Frontend)
 * =====================================
 * Single source of truth for all simulator metadata on the frontend.
 *
 * To add a new simulator:
 * 1. Add its metadata object to SIMULATORS below.
 * 2. Create its component in src/simulations/<subject>/<id>/
 * 3. Add its lazy import and route in src/App.jsx
 *
 * No other files need to be modified.
 */

export const SUBJECT_META = {
  chemistry: {
    label: "Chemistry",
    icon: "⚗️",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  physics: {
    label: "Physics",
    icon: "⚡",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
  mathematics: {
    label: "Mathematics",
    icon: "📐",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
  },
  biology: {
    label: "Biology",
    icon: "🌿",
    color: "#84cc16",
    gradient: "linear-gradient(135deg, #84cc16, #65a30d)",
  },
  computer_science: {
    label: "Computer Science",
    icon: "💻",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
  },
};

export const SIMULATORS = [
  // ─── CHEMISTRY ──────────────────────────────────────────────────────────
  {
    id: "solid-state",
    title: "Crystal Lattice Explorer",
    description:
      "Visualize SC, BCC, and FCC cubic crystal structures in 3D. Explore packing efficiency, coordination numbers, and unit cell geometry.",
    subject: "chemistry",
    topic: "Solid State Chemistry",
    difficulty: "intermediate",
    route: "/simulations/solid-state",
    status: "available",
    backendEndpoint: "/api/simulations/solid-state",
    learningObjectives: [
      "Understand the three cubic crystal systems (SC, BCC, FCC)",
      "Calculate atomic packing efficiency",
      "Determine coordination numbers",
      "Relate lattice parameters to physical properties",
    ],
    tags: ["crystal", "lattice", "3d", "solid-state", "packing"],
    visualizationType: "3d",
    thumbnailColor: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    icon: "🔬",
  },
  {
    id: "molecular-geometry",
    title: "Molecular Geometry",
    description: "Explore VSEPR theory and 3D molecular shapes interactively.",
    subject: "chemistry",
    topic: "Molecular Geometry",
    difficulty: "beginner",
    route: "/simulations/molecular-geometry",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Apply VSEPR theory to predict molecular shapes",
      "Understand bond angles and molecular polarity",
    ],
    tags: ["VSEPR", "molecular", "geometry", "bonding"],
    visualizationType: "3d",
    thumbnailColor: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    icon: "⚗️",
  },
  {
    id: "atomic-orbitals",
    title: "Atomic Orbitals",
    description: "Visualize electron probability densities for s, p, d orbitals.",
    subject: "chemistry",
    topic: "Atomic Structure",
    difficulty: "advanced",
    route: "/simulations/atomic-orbitals",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand orbital shapes and quantum numbers",
      "Interpret electron probability densities",
    ],
    tags: ["orbitals", "quantum", "electron", "wavefunction"],
    visualizationType: "3d",
    thumbnailColor: "linear-gradient(135deg, #3b82f6, #6366f1)",
    icon: "⚛️",
  },
  {
    id: "reaction-kinetics",
    title: "Reaction Kinetics",
    description: "Simulate concentration vs time for zero, first, and second order reactions.",
    subject: "chemistry",
    topic: "Chemical Kinetics",
    difficulty: "intermediate",
    route: "/simulations/reaction-kinetics",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand reaction rate laws",
      "Differentiate zero, first, and second order kinetics",
    ],
    tags: ["kinetics", "reaction", "rate", "concentration"],
    visualizationType: "graph",
    thumbnailColor: "linear-gradient(135deg, #10b981, #059669)",
    icon: "🧪",
  },

  // ─── PHYSICS ────────────────────────────────────────────────────────────
  {
    id: "projectile-motion",
    title: "Projectile Motion",
    description:
      "Simulate 2D projectile trajectories with adjustable launch angle, speed, and gravity. Calculates range, max height, and time of flight.",
    subject: "physics",
    topic: "Classical Mechanics",
    difficulty: "beginner",
    route: "/simulations/projectile-motion",
    status: "available",
    backendEndpoint: "/api/simulations/projectile-motion",
    learningObjectives: [
      "Decompose motion into horizontal and vertical components",
      "Apply kinematic equations to projectile problems",
      "Understand the effect of launch angle on range",
    ],
    tags: ["projectile", "kinematics", "trajectory", "mechanics"],
    visualizationType: "2d",
    thumbnailColor: "linear-gradient(135deg, #f59e0b, #ef4444)",
    icon: "🚀",
  },
  {
    id: "simple-harmonic-motion",
    title: "Simple Harmonic Motion",
    description: "Explore spring-mass systems, pendulums, and oscillation dynamics.",
    subject: "physics",
    topic: "Oscillations & Waves",
    difficulty: "intermediate",
    route: "/simulations/simple-harmonic-motion",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand Hooke's Law and restoring forces",
      "Calculate period, frequency, and amplitude",
    ],
    tags: ["oscillation", "spring", "pendulum", "SHM"],
    visualizationType: "animation",
    thumbnailColor: "linear-gradient(135deg, #ec4899, #f43f5e)",
    icon: "🌊",
  },
  {
    id: "wave-interference",
    title: "Wave Interference",
    description: "Visualize constructive and destructive interference patterns.",
    subject: "physics",
    topic: "Waves & Optics",
    difficulty: "intermediate",
    route: "/simulations/wave-interference",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand the superposition principle",
      "Distinguish constructive from destructive interference",
    ],
    tags: ["waves", "interference", "superposition", "optics"],
    visualizationType: "2d",
    thumbnailColor: "linear-gradient(135deg, #06b6d4, #0891b2)",
    icon: "〰️",
  },
  {
    id: "electric-fields",
    title: "Electric Fields",
    description: "Visualize electric field lines and equipotential surfaces for point charges.",
    subject: "physics",
    topic: "Electrostatics",
    difficulty: "advanced",
    route: "/simulations/electric-fields",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Apply Coulomb's Law",
      "Understand electric field superposition",
    ],
    tags: ["electric", "field", "coulomb", "electrostatics"],
    visualizationType: "2d",
    thumbnailColor: "linear-gradient(135deg, #f59e0b, #f97316)",
    icon: "⚡",
  },

  // ─── MATHEMATICS ────────────────────────────────────────────────────────
  {
    id: "function-explorer",
    title: "Mathematical Function Explorer",
    description:
      "Plot and analyze any mathematical function in real-time. Supports derivatives, integrals, roots, and critical points via SymPy.",
    subject: "mathematics",
    topic: "Functions & Calculus",
    difficulty: "beginner",
    route: "/simulations/function-explorer",
    status: "available",
    backendEndpoint: "/api/simulations/function-explorer",
    learningObjectives: [
      "Visualize function behavior graphically",
      "Compute derivatives and integrals symbolically",
      "Identify roots, maxima, and minima",
    ],
    tags: ["function", "graph", "calculus", "derivative", "integral"],
    visualizationType: "graph",
    thumbnailColor: "linear-gradient(135deg, #22c55e, #16a34a)",
    icon: "📈",
  },
  {
    id: "vector-fields",
    title: "Vector Fields",
    description: "Visualize 2D vector fields and stream lines for various functions.",
    subject: "mathematics",
    topic: "Multivariable Calculus",
    difficulty: "advanced",
    route: "/simulations/vector-fields",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand divergence and curl",
      "Visualize gradient fields",
    ],
    tags: ["vector", "field", "gradient", "curl", "divergence"],
    visualizationType: "2d",
    thumbnailColor: "linear-gradient(135deg, #14b8a6, #0d9488)",
    icon: "🧭",
  },
  {
    id: "differential-equations",
    title: "Differential Equations",
    description: "Plot slope fields and numerical solutions to first-order ODEs.",
    subject: "mathematics",
    topic: "Differential Equations",
    difficulty: "advanced",
    route: "/simulations/differential-equations",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand slope fields as a visual tool",
      "Apply Euler and RK4 methods numerically",
    ],
    tags: ["ODE", "differential", "slope-field", "numerical"],
    visualizationType: "graph",
    thumbnailColor: "linear-gradient(135deg, #a855f7, #9333ea)",
    icon: "∫",
  },

  // ─── BIOLOGY ────────────────────────────────────────────────────────────
  {
    id: "population-growth",
    title: "Population Growth Models",
    description: "Compare logistic and exponential population growth models.",
    subject: "biology",
    topic: "Ecology & Population Dynamics",
    difficulty: "beginner",
    route: "/simulations/population-growth",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Differentiate exponential from logistic growth",
      "Understand carrying capacity",
    ],
    tags: ["population", "ecology", "logistic", "growth"],
    visualizationType: "graph",
    thumbnailColor: "linear-gradient(135deg, #84cc16, #65a30d)",
    icon: "🌿",
  },
  {
    id: "dna-structure",
    title: "DNA Double Helix",
    description: "Interactive 3D visualization of the DNA double helix structure.",
    subject: "biology",
    topic: "Molecular Biology",
    difficulty: "beginner",
    route: "/simulations/dna-structure",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand base pairing rules",
      "Visualize the antiparallel double helix",
    ],
    tags: ["DNA", "helix", "nucleotide", "molecular"],
    visualizationType: "3d",
    thumbnailColor: "linear-gradient(135deg, #f43f5e, #e11d48)",
    icon: "🧬",
  },

  // ─── COMPUTER SCIENCE ───────────────────────────────────────────────────
  {
    id: "sorting-algorithms",
    title: "Sorting Algorithms",
    description: "Animate and compare bubble, merge, quick, and heap sort algorithms.",
    subject: "computer_science",
    topic: "Algorithms & Data Structures",
    difficulty: "beginner",
    route: "/simulations/sorting-algorithms",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand time complexity of sorting algorithms",
      "Compare algorithm efficiency visually",
    ],
    tags: ["sorting", "algorithms", "complexity", "animation"],
    visualizationType: "animation",
    thumbnailColor: "linear-gradient(135deg, #f97316, #ea580c)",
    icon: "📊",
  },
  {
    id: "graph-algorithms",
    title: "Graph Algorithms",
    description: "Visualize BFS, DFS, Dijkstra, and A* on interactive graphs.",
    subject: "computer_science",
    topic: "Graph Theory",
    difficulty: "intermediate",
    route: "/simulations/graph-algorithms",
    status: "coming_soon",
    backendEndpoint: null,
    learningObjectives: [
      "Understand traversal strategies (BFS vs DFS)",
      "Apply shortest path algorithms",
    ],
    tags: ["graph", "BFS", "DFS", "Dijkstra", "pathfinding"],
    visualizationType: "diagram",
    thumbnailColor: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    icon: "🕸️",
  },
];

// ─── Registry query helpers ──────────────────────────────────────────────────

export function getAll() {
  return SIMULATORS;
}

export function getById(id) {
  return SIMULATORS.find((s) => s.id === id) || null;
}

export function getBySubject(subject) {
  return SIMULATORS.filter((s) => s.subject === subject);
}

export function getAvailable() {
  return SIMULATORS.filter((s) => s.status === "available");
}

export function getSubjectCounts() {
  const counts = {};
  for (const sim of SIMULATORS) {
    if (!counts[sim.subject]) {
      counts[sim.subject] = { total: 0, available: 0 };
    }
    counts[sim.subject].total++;
    if (sim.status === "available") counts[sim.subject].available++;
  }
  return counts;
}

export function filterSimulators({ subject, difficulty, status, search } = {}) {
  return SIMULATORS.filter((s) => {
    if (subject && s.subject !== subject) return false;
    if (difficulty && s.difficulty !== difficulty) return false;
    if (status && s.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      const searchable = [s.title, s.description, s.topic, ...s.tags].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}
