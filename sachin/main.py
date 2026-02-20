# ─────────────────────────────────────────────────────────────
#  SACHIN — FastAPI Application Entry Point
#  Database Connectivity & REST API Module
# ─────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import wards, health, water, alerts, predictions

app = FastAPI(
    title="Neervazh Kavalan — Data API",
    description="REST endpoints for ward data, health cases, water quality, alerts & predictions.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # seran's Next.js dashboard
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wards.router,       prefix="/api/wards",       tags=["Wards"])
app.include_router(health.router,      prefix="/api/health",      tags=["Health Cases"])
app.include_router(water.router,       prefix="/api/water",       tags=["Water Quality"])
app.include_router(alerts.router,      prefix="/api/alerts",      tags=["Alerts"])
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions"])


@app.get("/health")
async def health_check():
    return {"status": "ok", "module": "db-connectivity"}
