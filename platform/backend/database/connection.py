"""
PRISM Database Connection Factory
=================================
Supports PostgreSQL production databases with seamless local SQLite fallback.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Local developer fallback: SQLite database
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "prism.db"))
    DATABASE_URL = f"sqlite:///{db_path}"

# SQLite requires check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI Dependency for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    import database.models  # ensure models are imported
    Base.metadata.create_all(bind=engine)

