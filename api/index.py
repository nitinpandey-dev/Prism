"""
PRISM – Vercel Serverless Entry Point (Repository Root)
Forwards requests to platform/backend FastAPI application.
"""
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "platform", "backend"))
if not os.path.exists(backend_dir):
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "platform", "backend"))

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app

try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except Exception:
    handler = app
