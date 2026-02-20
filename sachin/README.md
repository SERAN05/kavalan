# Module 3 — Database Connectivity
**Owner: Sachin**  
**Stack: Python · FastAPI · SQLAlchemy (async) · PostgreSQL + PostGIS · Alembic**

---

## What This Module Does
This module is the **data layer** of Neervazh Kavalan. It:
- Owns all database schemas and migrations (Alembic)
- Exposes a REST API (`/api/*`) consumed by seran's dashboard
- Handles CSV data uploads and seeding from `mock_seed_data/`
- Stores health cases, water quality, weather, alerts, and risk predictions
- Bridges between the real-time data ingestion pipeline and the frontend

The existing Next.js API routes from the old project are in `nextjs_api_routes/` as reference. Replace them with FastAPI equivalents here.

---

## Folder Structure
```
sachin/
├── routers/
│   ├── wards.py        ← GET /api/wards/
│   ├── health.py       ← GET /api/health/{ward_id}
│   ├── water.py        ← GET /api/water/{ward_id}
│   ├── alerts.py       ← GET/PATCH /api/alerts/
│   └── predictions.py  ← GET /api/predictions/{ward_id}
├── nextjs_api_routes/  ← Reference only (old Next.js routes)
├── mock_seed_data/     ← CSVs + JSON for initial DB seeding
│   ├── health_sample.csv
│   ├── water_quality_sample.csv
│   └── wards.json
├── lib/
│   └── mock-data.ts    ← Reference for data shapes (TypeScript)
├── database.py         ← Async SQLAlchemy engine + session
├── models.py           ← ORM models (Ward, HealthCase, WaterQuality, Alert, etc.)
├── main.py             ← FastAPI app entry point
└── requirements.txt
```

---

## Getting Started

```bash
cd kavalan/sachin
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Copy and fill in your DB credentials
cp .env.example .env

# Run DB migrations
alembic upgrade head

# Start API server
uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

---

## Key Tasks (from todo.txt)
- [ ] Set up PostgreSQL + PostGIS locally with Docker
- [ ] Write Alembic migration for all ORM models
- [ ] Write seed script to import `mock_seed_data/*.csv` → DB
- [ ] Add CSV upload endpoint (mirrors old `/app/api/upload`)
- [ ] Add data quality checks (null thresholds, duplicate suppression)
- [ ] Add TimescaleDB hypertable for `water_quality` and `health_cases`
- [ ] Add role-based DB users + TLS
- [ ] Add ingestion observability (per-source row counts, lag metrics)

---

## Environment Variables
```bash
# .env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/neervazh
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
```
