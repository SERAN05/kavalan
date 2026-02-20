# ─────────────────────────────────────────────────────────────
#  RUPESH — Feature Engineering Pipeline
#  Neervazh Kavalan · Module 2: Model Training & Dataset
# ─────────────────────────────────────────────────────────────

import pandas as pd
import numpy as np
from pathlib import Path

DATA_DIR = Path(__file__).parent / "datasets"


def load_health_data() -> pd.DataFrame:
    """Load ward-level health case data."""
    return pd.read_csv(DATA_DIR / "health_sample.csv", parse_dates=["report_date"])


def load_water_quality_data() -> pd.DataFrame:
    """Load water quality samples."""
    return pd.read_csv(DATA_DIR / "water_quality_sample.csv", parse_dates=["sample_date"])


def compute_rolling_case_rate(df: pd.DataFrame, window: int = 7) -> pd.DataFrame:
    """7-day rolling average of cases per ward."""
    df = df.sort_values(["ward_id", "report_date"])
    df["cases_7d_avg"] = (
        df.groupby("ward_id")["cases_reported"]
        .transform(lambda x: x.rolling(window, min_periods=1).mean())
    )
    return df


def compute_water_risk_score(df: pd.DataFrame) -> pd.DataFrame:
    """Composite water risk: coliform + turbidity + pH deviation."""
    df["ph_deviation"] = (df["ph"] - 7.0).abs()
    df["water_risk"] = (
        0.5 * df["coliform_cfu"].clip(0, 500) / 500
        + 0.3 * df["turbidity_ntu"].clip(0, 10) / 10
        + 0.2 * df["ph_deviation"].clip(0, 3) / 3
    ) * 100
    return df


def build_feature_matrix(
    health: pd.DataFrame,
    water: pd.DataFrame,
    horizon_days: int = 7,
) -> pd.DataFrame:
    """
    Merge all feature sources for a given prediction horizon.
    Returns feature matrix X and target y (outbreak flag).
    """
    health = compute_rolling_case_rate(health)
    water = compute_water_risk_score(water)

    # Create target: did cases spike horizon_days later?
    health = health.sort_values(["ward_id", "report_date"])
    health["future_cases"] = (
        health.groupby("ward_id")["cases_reported"]
        .shift(-horizon_days)
    )
    health["outbreak_risk"] = (health["future_cases"] > health["cases_7d_avg"] * 1.5).astype(int)

    # Merge on ward_id + nearest date
    water_agg = (
        water.groupby("ward_id")
        .agg(
            avg_water_risk=("water_risk", "mean"),
            max_coliform=("coliform_cfu", "max"),
            avg_ph=("ph", "mean"),
        )
        .reset_index()
    )

    merged = health.merge(water_agg, on="ward_id", how="left")

    feature_cols = [
        "ward_id",
        "cases_7d_avg",
        "avg_water_risk",
        "max_coliform",
        "avg_ph",
    ]
    return merged[feature_cols + ["outbreak_risk"]].dropna()


if __name__ == "__main__":
    health = load_health_data()
    water = load_water_quality_data()
    feature_df = build_feature_matrix(health, water, horizon_days=7)
    print(f"Feature matrix shape: {feature_df.shape}")
    print(feature_df.head())
