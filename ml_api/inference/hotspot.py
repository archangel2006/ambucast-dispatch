# MODEL INFERENCE FILE

import numpy as np
import pandas as pd
import joblib

class HotspotPredictor:
    def __init__(self):
        self.model = joblib.load("models/hotspotcast.pkl")

    def preprocess(self, data: dict):
        # convert to dataframe
        df = pd.DataFrame([data])

        # time features (IMPORTANT)
        df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
        df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

        df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
        df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

        return df

    def predict(self, data: dict):
        df = self.preprocess(data)

        features = [
            "hour_sin", "hour_cos",
            "dow_sin", "dow_cos",
            "PM2.5", "PM10", "AQI",
            "temperature", "humidity",
            "population_density", "elderly_pct"
        ]

        preds = self.model.predict(df[features])
        preds = np.clip(preds, 0, None)

        return int(preds[0])