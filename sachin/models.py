# ─────────────────────────────────────────────────────────────
#  SACHIN — ORM Models
#  All core database tables for Neervazh Kavalan
# ─────────────────────────────────────────────────────────────

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime,
    ForeignKey, Text, Enum as PgEnum
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from .database import Base


class Ward(Base):
    __tablename__ = "wards"

    id = Column(Integer, primary_key=True, index=True)
    ward_number = Column(Integer, unique=True, nullable=False)
    ward_name = Column(String(120), nullable=False)
    zone = Column(String(80))
    population = Column(Integer)
    geometry = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class HealthCase(Base):
    __tablename__ = "health_cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False, index=True)
    disease = Column(String(100))
    cases_reported = Column(Integer, default=0)
    hospitalised = Column(Integer, default=0)
    report_date = Column(DateTime(timezone=True), index=True)
    source = Column(String(80))  # PHC, Hospital, FieldWorker
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WaterQuality(Base):
    __tablename__ = "water_quality"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False, index=True)
    ph = Column(Float)
    turbidity_ntu = Column(Float)
    coliform_cfu = Column(Float)
    chlorine_mg_l = Column(Float)
    sample_date = Column(DateTime(timezone=True), index=True)
    source_type = Column(String(80))  # tap, borewell, surface
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(Integer, ForeignKey("wards.id"), index=True)
    temperature_c = Column(Float)
    rainfall_mm = Column(Float)
    humidity_pct = Column(Float)
    recorded_at = Column(DateTime(timezone=True), index=True)


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(Integer, ForeignKey("wards.id"), nullable=False, index=True)
    risk_score = Column(Float)  # 0–100
    risk_band = Column(String(20))  # Low / Medium / High / Critical
    horizon_days = Column(Integer)  # 7 or 14
    model_version = Column(String(40))
    features_snapshot = Column(JSONB)
    predicted_at = Column(DateTime(timezone=True), server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(Integer, ForeignKey("wards.id"), index=True)
    alert_type = Column(String(80))  # threshold / trend / anomaly
    severity = Column(String(20))   # info / warning / critical
    message = Column(Text)
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(120))
    acknowledged_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
