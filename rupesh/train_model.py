# ─────────────────────────────────────────────────────────────
#  RUPESH — Model Training Script
#  Trains XGBoost + Random Forest baselines and logs to MLflow
# ─────────────────────────────────────────────────────────────

import mlflow
import mlflow.sklearn
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import (
    classification_report, roc_auc_score, f1_score
)
from xgboost import XGBClassifier
from .feature_engineering import load_health_data, load_water_quality_data, build_feature_matrix

MODELS_DIR = Path(__file__).parent / "trained_models"
MODELS_DIR.mkdir(exist_ok=True)

MLFLOW_TRACKING_URI = "http://localhost:5000"
EXPERIMENT_NAME = "neervazh-kavalan-risk-model"


def train(horizon_days: int = 7):
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment(EXPERIMENT_NAME)

    health = load_health_data()
    water = load_water_quality_data()
    df = build_feature_matrix(health, water, horizon_days=horizon_days)

    feature_cols = ["cases_7d_avg", "avg_water_risk", "max_coliform", "avg_ph"]
    X = df[feature_cols].values
    y = df["outbreak_risk"].values

    print(f"Training on {len(X)} samples | Positive rate: {y.mean():.2%}")

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    # ── XGBoost ──────────────────────────────────────────────
    with mlflow.start_run(run_name=f"xgb-horizon{horizon_days}d"):
        xgb = XGBClassifier(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            use_label_encoder=False,
            eval_metric="logloss",
            random_state=42,
        )
        scores = cross_val_score(xgb, X, y, cv=cv, scoring="roc_auc")
        xgb.fit(X, y)

        mlflow.log_params({"model": "XGBoost", "horizon_days": horizon_days})
        mlflow.log_metrics({
            "cv_roc_auc_mean": scores.mean(),
            "cv_roc_auc_std": scores.std(),
        })
        mlflow.sklearn.log_model(xgb, "model")

        joblib.dump(xgb, MODELS_DIR / f"xgb_h{horizon_days}.pkl")
        print(f"XGBoost CV AUC: {scores.mean():.3f} ± {scores.std():.3f}")

    # ── Random Forest ─────────────────────────────────────────
    with mlflow.start_run(run_name=f"rf-horizon{horizon_days}d"):
        rf = RandomForestClassifier(
            n_estimators=300, max_depth=6, random_state=42, n_jobs=-1
        )
        scores = cross_val_score(rf, X, y, cv=cv, scoring="roc_auc")
        rf.fit(X, y)

        mlflow.log_params({"model": "RandomForest", "horizon_days": horizon_days})
        mlflow.log_metrics({
            "cv_roc_auc_mean": scores.mean(),
            "cv_roc_auc_std": scores.std(),
        })
        mlflow.sklearn.log_model(rf, "model")

        joblib.dump(rf, MODELS_DIR / f"rf_h{horizon_days}.pkl")
        print(f"RandomForest CV AUC: {scores.mean():.3f} ± {scores.std():.3f}")


if __name__ == "__main__":
    train(horizon_days=7)
    train(horizon_days=14)
