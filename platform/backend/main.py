"""
PRISM FastAPI Backend
=====================
Extensible multi-simulation educational platform.

Architecture:
- /api/registry  → simulator catalog (metadata, filtering, search)
- /api/simulations/<id>  → per-simulator computation endpoints

Adding a new simulator:
1. Implement engine in simulations/<subject>/<id>/engine.py
2. Create router in routers/simulations/<id>_router.py
3. Add metadata to registry.py
4. Include router below in `include_routers()`
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers.registry_router import router as registry_router
from routers.progress_router import router as progress_router
from routers.aria_router import router as aria_router
from routers.simulations.solid_state_router import router as solid_state_router
from routers.simulations.projectile_router import router as projectile_router
from routers.simulations.function_router import router as function_router
from routers.simulations.harmonic_router import router as harmonic_router
from routers.simulations.all_simulations_router import (
    wave_router,
    electric_router,
    kinetics_router,
    orbitals_router,
    molecular_router,
    ode_router,
    vector_field_router,
    population_router,
    sorting_router,
)

app = FastAPI(
    title="PRISM API",
    description="Extensible multi-subject STEM simulation platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS – allow local dev + any Vercel deployment domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Vercel preview URLs are unpredictable; wildcard is safe for a public educational platform
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



from database.connection import init_db

def include_routers():
    """
    Register all simulation routers here.
    """
    app.include_router(registry_router)
    app.include_router(progress_router)
    app.include_router(aria_router)
    app.include_router(solid_state_router)
    app.include_router(projectile_router)
    app.include_router(function_router)
    app.include_router(harmonic_router)
    app.include_router(wave_router)
    app.include_router(electric_router)
    app.include_router(kinetics_router)
    app.include_router(orbitals_router)
    app.include_router(molecular_router)
    app.include_router(ode_router)
    app.include_router(vector_field_router)
    app.include_router(population_router)
    app.include_router(sorting_router)


include_routers()

try:
    init_db()
except Exception as e:
    print(f"Database init warning: {e}")


@app.get("/")
@app.get("/api")
def api_root():
    return {
        "platform": "PRISM",
        "description": "Extensible multi-subject STEM simulation platform API",
        "status": "online",
        "docs": "/api/docs",
        "version": "1.0.0"
    }


@app.get("/api/health")
@app.get("/health")
def health():
    return {"status": "ok", "platform": "PRISM", "version": "1.0.0"}


@app.exception_handler(404)
async def not_found(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Endpoint not found"})


@app.exception_handler(500)
async def server_error(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
