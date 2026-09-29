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
from routers.simulations.solid_state_router import router as solid_state_router
from routers.simulations.projectile_router import router as projectile_router
from routers.simulations.function_router import router as function_router

app = FastAPI(
    title="PRISM API",
    description="Extensible multi-subject STEM simulation platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS – allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def include_routers():
    """
    Register all simulation routers here.
    Each new simulator gets one line added here — nothing else changes.
    """
    app.include_router(registry_router)
    app.include_router(solid_state_router)
    app.include_router(projectile_router)
    app.include_router(function_router)


include_routers()


@app.get("/api/health")
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
