# PRISM — Interactive STEM Simulation Platform

> **“Turning abstract concepts into things you can see.”**

PRISM is a student-focused, interactive STEM simulation platform where complex mathematical, scientific, and algorithmic concepts are understood through direct visual manipulation and real-time computation.

---

## 🔬 Product Philosophy & Design

PRISM is structured as a **minimal scientific simulation workspace**:
- **Single-Page Architecture**: Zero complex page routes, zero login walls, zero decorative marketing fluff.
- **Direct Workspace Expansion**: Select a simulation, and it expands immediately to occupy the primary screen.
- **Learn → Manipulate → Simulate → Visualize → Understand**: Large dominant canvas visualizers, minimal sliders/controls, and live monospace equation readouts.

---

## 🧪 The 5 Core Interactive Simulations

### 01 · Projectile Motion (Physics)
- **Visuals**: Full 2D trajectory animation, velocity vector with arrowhead, launch angle marker, peak height marker ($H_{\max}$), ground landing range ($R$), and paused-state info overlay.
- **Physics Equations**:
  $$T = \frac{2u \sin\theta}{g}, \quad R = \frac{u^2 \sin(2\theta)}{g}, \quad H = \frac{u^2 \sin^2\theta}{2g}$$
- **Controls**: Initial velocity $u$, launch angle $\theta$, gravity $g$, adjustable playback speed ($0.2\text{×}$–$3.0\text{×}$), Play/Pause/Resume/Replay.
- **Pause Controls**: **Pause-at-time** — set a specific $t$ to auto-pause the simulation with an orange crosshair marker on the trajectory. **Timeline Scrub** — drag to any point in the flight. **Step Forward/Backward** — advance or rewind by $0.05s$ increments when paused.
- **Live Metrics**: Flight time, horizontal range, maximum height, real-time $(x, y)$ coordinates, instantaneous velocity, and vertical velocity $V_y$.

### 02 · Crystal Structures (Solid State Chemistry)
- **Visuals**: Interactive 3D unit cell cube with spherical atoms, depth shading, mouse drag-to-rotate, and continuous auto-rotation.
- **Lattice Systems**:
  - **SC (Simple Cubic)**: $Z = 1$, Coordination $= 6$, Packing Efficiency $= 52.4\%$, $a = 2r$.
  - **BCC (Body-Centred Cubic)**: $Z = 2$, Coordination $= 8$, Packing Efficiency $= 68.0\%$, $\sqrt{3}a = 4r$.
  - **FCC (Face-Centred Cubic)**: $Z = 4$, Coordination $= 12$, Packing Efficiency $= 74.0\%$, $\sqrt{2}a = 4r$.
- **Controls**: Structure toggle (`SC`, `BCC`, `FCC`), atomic radius slider $r$ ($60\text{–}220\text{ pm}$), auto-rotation toggle, view reset.
- **Live Metrics**: Atoms per cell ($Z$), coordination number, packing efficiency %, edge length $a$, and density $\rho = \frac{ZM}{N_A a^3}$.

### 03 · Function Visualizer (Mathematics)
- **Visuals**: Dynamic Cartesian coordinate plane with numeric ticks, responsive grid, smooth curve plotting, and interactive hover crosshair with tangent line tracking.
- **Functions**: Quadratic ($y = ax^2$), Sine ($y = a\sin(bx)$), Cosine ($y = a\cos(bx)$), Exponential ($y = ae^{bx}$), Logarithm ($y = a\ln(bx)$).
- **Controls**: Function selector, parameter $a$ slider, frequency/parameter $b$ slider, zoom range ($\pm5$, $\pm10$).
- **Live Metrics**: Dynamic equation formula, $y$-intercept $f(0)$, instantaneous tangent slope $f'(x)$, and cursor coordinates $(x, y)$.

### 04 · Wave Superposition & Interference (Physics)
- **Visuals**: Dual-wave canvas with real-time superposition rendering. Individual waves shown as dashed lines (blue + amber), resultant as solid green with area fill.
- **Physics**: Superposition principle $y(x) = y_1(x) + y_2(x)$ where $y_i = A_i \sin(f_i x + \varphi_i)$.
- **Controls**: Independent amplitude $A$, frequency $f$, and phase $\varphi$ sliders for each wave. Toggle visibility of Wave 1, Wave 2, and resultant.
- **Presets**: Constructive ($\Delta\varphi = 0$), Destructive ($\Delta\varphi = \pi$), Beat Pattern (close frequencies), Harmonic (octave), Complex.
- **Animation**: Optional traveling wave mode with real-time propagation.
- **Live Metrics**: Interference type (constructive/destructive/partial/beat), maximum resultant amplitude ($A_1 + A_2$), minimum resultant ($|A_1 - A_2|$), and beat frequency $f_{\text{beat}} = |f_1 - f_2|$.
- **Instant Results**: All calculations and rendering update immediately on slider changes — zero wait time.

### 05 · Graph Traversal (Algorithms & Data Structures)
- **Visuals**: 7-node network ($A$ through $G$) connected by bidirectional edges.
- **Algorithms**: `Breadth-First Search (BFS)` (FIFO queue frontier) and `Depth-First Search (DFS)` (LIFO call stack).
- **Highlights**: Active traversing edge (blue highlight), current active node (pulsing blue ring), visited nodes (green badge with visit sequence order).
- **Controls**: Algorithm selector (`BFS` / `DFS`), starting node selector ($A\text{–}G$), step delay slider, Start/Pause/Replay, Reset.
- **Live Metrics**: Sequence order ($A \to B \to \dots$), queue/stack state array, visited count, and $O(V + E)$ complexity indicator.

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 18, Vite, HTML5 Canvas, SVG, Vanilla CSS (clean scientific academic white theme).
- **Backend API**: Python 3.11+, FastAPI, NumPy, SciPy (`scipy.integrate.solve_ivp`), SymPy.
- **Standalone 3D Simulation**: `solar_system.py` (Pure-Python 3D interactive Solar System powered by VPython).

---

## 🚀 Running Locally

### 1. Run the Frontend Simulation Workspace
```bash
cd platform/frontend
npm install
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 2. Run the Python FastAPI Backend (Optional / Scientific API)
```bash
cd platform/backend
pip install -r requirements.txt
python main.py
```
FastAPI server runs on **[http://localhost:8000/api](http://localhost:8000/api)** with interactive docs at **[http://localhost:8000/api/docs](http://localhost:8000/api/docs)**.

### 3. Run Standalone Pure-Python 3D Solar System
```bash
pip install -r requirements-solar.txt
python solar_system.py
```
Automatically launches a local browser tab running the pure-Python 3D VPython simulation.

---

## 📁 Repository Structure

```
Prism/
├── platform/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── simulations/
│   │   │   │   ├── ProjectileMotionSim.jsx
│   │   │   │   ├── CrystalStructuresSim.jsx
│   │   │   │   ├── FunctionVisualizerSim.jsx
│   │   │   │   ├── WaveSuperpositionSim.jsx
│   │   │   │   └── GraphTraversalSim.jsx
│   │   │   ├── App.jsx            # Single-page workspace orchestrator
│   │   │   ├── App.css            # Minimal scientific design styling
│   │   │   └── index.css          # Clean white theme tokens
│   │   └── package.json
│   └── backend/
│       ├── simulations/           # NumPy & SciPy computation engines
│       ├── routers/               # FastAPI route definitions
│       └── main.py                # FastAPI entry point
├── solar_system.py                # Standalone pure-Python 3D simulation
├── requirements.txt               # Platform Python dependencies
└── README.md
```
