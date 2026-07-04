# MODEL INFERENCE FILE

import json
import numpy as np
import pandas as pd
import joblib
import os


class HotspotPredictor:
    def __init__(self):
        model_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(model_dir, "../models/hotspotcast.pkl")
        self.model = joblib.load(model_path)

        history_path = os.path.join(model_dir, "../data/zone_history.json")
        self.history = {}
        if os.path.exists(history_path):
            with open(history_path, "r", encoding="utf-8") as f:
                self.history = json.load(f)

    def _get_history(self, data: dict):
        zone_id = str(data.get("zone_id", "")).upper()
        if zone_id in self.history:
            return self.history[zone_id]

        index_factor = sum(ord(c) for c in zone_id if c.isalnum()) % 6
        return {
            "rolling_calls_7": float(np.clip(
                2.0 + (data["population_density"] / 10000.0) * 0.8 + (data["elderly_pct"] * 12.0) + (data["AQI"] / 120.0) + (index_factor * 0.6),
                1.0,
                20.0
            )),
            "lag_24h": float(np.clip(
                1.5 + (data["temperature"] / 28.0) + (data["humidity"] / 55.0) + (data["elderly_pct"] * 6.0) + (index_factor * 0.4),
                1.0,
                20.0
            ))
        }

    def preprocess(self, data: dict):
        # convert to dataframe
        df = pd.DataFrame([data])

        # time features (IMPORTANT)
        df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
        df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

        df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
        df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

        history = self._get_history(data)
        df["rolling_calls_7"] = history["rolling_calls_7"]
        df["lag_24h"] = history["lag_24h"]

        return df

    def predict(self, data: dict):
        df = self.preprocess(data)

        features = [
            "hour_sin", "hour_cos",
            "dow_sin", "dow_cos",
            "PM2.5", "PM10", "AQI",
            "temperature", "humidity",
            "population_density", "elderly_pct",
            "rolling_calls_7",  "lag_24h"
        ]

        preds = self.model.predict(df[features])
        preds = np.clip(preds, 0, None)
        predicted = max(1, int(round(preds[0])))

        return predicted