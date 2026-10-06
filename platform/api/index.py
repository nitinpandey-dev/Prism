"""
PRISM – Vercel Serverless Entry Point
Exposes the FastAPI `app` for Vercel's native ASGI Python runtime.
"""
import sys
import os

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if os.path.exists(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Fallback for alternative execution directory layouts
alt_backend = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if os.path.exists(alt_backend) and alt_backend not in sys.path:
    sys.path.insert(0, alt_backend)

from main import app

# Optional Mangum adapter for legacy AWS Lambda environments if installed
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except Exception:
    handler = app
