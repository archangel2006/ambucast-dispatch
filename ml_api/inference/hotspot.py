# MODEL INFERENCE FILE

import numpy as np
import pandas as pd
import joblib
import os


class HotspotPredictor:
    def __init__(self):
        
        model_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(model_dir, "../models/hotspotcast.pkl")
        self.model = joblib.load(model_path)

    def preprocess(self, data: dict):
        # convert to dataframe
        df = pd.DataFrame([data])

        # time features (IMPORTANT)
        df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
        df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)

        df["dow_sin"] = np.sin(2 * np.pi * df["day_of_week"] / 7)
        df["dow_cos"] = np.cos(2 * np.pi * df["day_of_week"] / 7)

        df["rolling_calls_7"] = 5.0
        df["lag_24h"] = 5.0

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