# ─────────────────────────────────────────────────────────────
#  TARUN — Risk Prediction Router
#  Loads trained model from rupesh/trained_models/ and scores
# ─────────────────────────────────────────────────────────────

import joblib
import numpy as np
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal

router = APIRouter()

MODEL_DIR = Path(__file__).parent.parent.parent / "rupesh" / "trained_models"


class WardFeatures(BaseModel):
    cases_7d_avg: float
    avg_water_risk: float
    max_coliform: float
    avg_ph: float


class PredictionResponse(BaseModel):
    ward_id: int
    horizon_days: int
    risk_score: float       # 0–100
    risk_band: Literal["Low", "Medium", "High", "Critical"]
    model_version: str


def _load_model(horizon: int):
    path = MODEL_DIR / f"xgb_h{horizon}.pkl"
    if not path.exists():
        raise FileNotFoundError(f"Model not found: {path}. Run rupesh/train_model.py first.")
    return joblib.load(path)


def _score_to_band(score: float) -> str:
    if score < 25:
        return "Low"
    elif score < 50:
        return "Medium"
    elif score < 75:
        return "High"
    return "Critical"


@router.post("/{ward_id}", response_model=PredictionResponse)
async def predict_risk(
    ward_id: int,
    features: WardFeatures,
    horizon: int = 7,
):
    if horizon not in (7, 14):
        raise HTTPException(status_code=400, detail="horizon must be 7 or 14")

    try:
        model = _load_model(horizon)
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    X = np.array([[
        features.cases_7d_avg,
        features.avg_water_risk,
        features.max_coliform,
        features.avg_ph,
    ]])

    proba = model.predict_proba(X)[0][1]  # probability of outbreak
    risk_score = round(proba * 100, 2)

    return PredictionResponse(
        ward_id=ward_id,
        horizon_days=horizon,
        risk_score=risk_score,
        risk_band=_score_to_band(risk_score),
        model_version=f"xgb_h{horizon}_v1",
    )
