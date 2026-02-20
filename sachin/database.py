# ─────────────────────────────────────────────────────────────
#  SACHIN — Database Connectivity Module
#  Neervazh Kavalan · Module 3: Database & API Layer
# ─────────────────────────────────────────────────────────────
# Responsibilities:
#   • PostgreSQL + PostGIS connection management
#   • Alembic migration scripts
#   • SQLAlchemy ORM models for all core tables
#   • FastAPI CRUD endpoints consumed by the dashboard
#   • Data ingestion (CSV → DB) helpers
# ─────────────────────────────────────────────────────────────

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from pydantic_settings import BaseSettings
from typing import AsyncGenerator


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/neervazh"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    class Config:
        env_file = ".env"


settings = Settings()

# ── Engine ────────────────────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    echo=False,
)

AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()


# ── Dependency injected into FastAPI routes ───────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
