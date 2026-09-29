# PRISM Platform — How to Add a New Simulator

## Overview

PRISM is built around a **centralized registry + modular engine** architecture.
Adding a new simulator requires touching exactly **5 files** — no existing files
need to be restructured or modified.

---

## Step-by-Step: Adding "Wave Interference" as an Example

### 1. Register the simulator metadata (Frontend)

Edit [`frontend/src/config/simulatorRegistry.js`](frontend/src/config/simulatorRegistry.js) and add an entry to `SIMULATORS`:

```javascript
{
  id: "wave-interference",
  title: "Wave Interference",
  description: "Visualize constructive and destructive interference patterns.",
  subject: "physics",
  topic: "Waves & Optics",
  difficulty: "intermediate",
  route: "/simulations/wave-interference",
  status: "available",          // change from "coming_soon" → "available"
  backendEndpoint: "/api/simulations/wave-interference",
  learningObjectives: [
    "Understand the superposition principle",
    "Distinguish constructive from destructive interference",
  ],
  tags: ["waves", "interference", "superposition"],
  visualizationType: "2d",
  thumbnailColor: "linear-gradient(135deg, #06b6d4, #0891b2)",
  icon: "〰️",
}
```

### 2. Register the simulator metadata (Backend)

Edit [`backend/registry.py`](backend/registry.py) and add an entry to `REGISTRY`:

```python
"wave-interference": SimulatorMeta(
    id="wave-interference",
    title="Wave Interference",
    description="Visualize constructive and destructive interference patterns.",
    subject=SubjectEnum.PHYSICS,
    topic="Waves & Optics",
    difficulty=DifficultyEnum.INTERMEDIATE,
    route="/simulations/wave-interference",
    status=SimulatorStatus.AVAILABLE,
    backend_endpoint="/api/simulations/wave-interference",
    learning_objectives=[...],
    tags=["waves", "interference"],
    visualization_type=VisualizationTypeEnum.TWO_D,
    thumbnail_color="linear-gradient(135deg, #06b6d4, #0891b2)",
    icon="〰️",
),
```

### 3. Implement the computation engine (Backend)

Create `backend/simulations/physics/wave_interference/engine.py`:

```python
import numpy as np
from pydantic import BaseModel, Field
from models.base import SimulationResult

class WaveRequest(BaseModel):
    frequency1: float = Field(1.0, gt=0, description="Frequency of wave 1 (Hz)")
    frequency2: float = Field(1.2, gt=0, description="Frequency of wave 2 (Hz)")
    amplitude1: float = Field(1.0, gt=0)
    amplitude2: float = Field(1.0, gt=0)
    x_range: float = Field(20.0, gt=0)

def compute_waves(req: WaveRequest) -> SimulationResult:
    x = np.linspace(0, req.x_range, 500)
    w1 = req.amplitude1 * np.sin(2 * np.pi * req.frequency1 * x)
    w2 = req.amplitude2 * np.sin(2 * np.pi * req.frequency2 * x)
    superposed = w1 + w2

    return SimulationResult(
        simulator_id="wave-interference",
        success=True,
        data={
            "x": x.tolist(),
            "wave1": w1.tolist(),
            "wave2": w2.tolist(),
            "superposed": superposed.tolist(),
        }
    )
```

Also create `backend/simulations/physics/wave_interference/__init__.py` (empty).

### 4. Create the API router (Backend)

Create `backend/routers/simulations/wave_router.py`:

```python
from fastapi import APIRouter, HTTPException
from simulations.physics.wave_interference.engine import WaveRequest, compute_waves
from models.base import SimulationResult

router = APIRouter(prefix="/api/simulations/wave-interference", tags=["Physics"])

@router.post("/", response_model=SimulationResult)
def run_waves(req: WaveRequest):
    try:
        return compute_waves(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

Then in `backend/main.py`, add ONE line inside `include_routers()`:

```python
from routers.simulations.wave_router import router as wave_router
# ...inside include_routers():
app.include_router(wave_router)
```

### 5. Create the simulation page (Frontend)

Create `frontend/src/simulations/physics/wave-interference/WavePage.jsx`
using the shared `SimulationLayout` components.

Then in `frontend/src/App.jsx`, add ONE lazy import and ONE route:

```javascript
const WavePage = lazy(() =>
  import("./simulations/physics/wave-interference/WavePage")
);

// Inside <Routes>:
<Route path="/simulations/wave-interference" element={<WavePage />} />
```

---

## What You DON'T Need to Change

- The Explore page — it auto-renders cards from the registry
- The Coming Soon routing — it's already set up as a catch-all
- The Homepage stats — they're computed dynamically from the registry
- The About page — it shows dynamic counts from the registry
- Any other existing simulator

---

## File Summary

| File | Action |
|------|--------|
| `frontend/src/config/simulatorRegistry.js` | Add metadata entry |
| `backend/registry.py` | Add metadata entry |
| `backend/simulations/<subject>/<id>/engine.py` | **Create** computation engine |
| `backend/routers/simulations/<id>_router.py` | **Create** API router |
| `backend/main.py` | Add 2 lines (import + include_router) |
| `frontend/src/simulations/<subject>/<id>/Page.jsx` | **Create** simulation page |
| `frontend/src/App.jsx` | Add 2 lines (lazy import + Route) |

**Total: 5 files to create, 3 files with 1–2 line additions.**
