from fastapi import FastAPI
from inference.hotspot import HotspotPredictor
from inference.riskpulse import calculate_risk
from schemas.input_schema import HotspotInput, PredictionResult
import numpy as np
from typing import List

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AmbuCast ML API running"}
model = HotspotPredictor()


def process_single_prediction(data: HotspotInput) -> PredictionResult:
    """Process a single zone prediction"""

    input_dict = {
        "AQI": data.aqi,
        "PM2.5": data.pm25,
        "PM10": data.pm10,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "hour": data.hour,                
        "day_of_week": data.day_of_week,  
        "population_density": data.population_density,
        "elderly_pct": data.elderly_pct,
    }
    
    # MODEL 1
    predicted_calls = model.predict(input_dict)

    # MODEL 2
    risk_output = calculate_risk(input_dict, predicted_calls)

    return PredictionResult(
        zone_id=data.zone_id,
        predicted_calls=int(predicted_calls),
        risk_score=risk_output["risk_score"],
        risk_class=risk_output["risk_class"],
        reasons=risk_output["reasons"]
    )

@app.post("/predict", response_model=PredictionResult)

def predict(data: HotspotInput):
    """Endpoint to predict ambulance demand and risk for a single zone"""
    result = process_single_prediction(data)
    return result

@app.post("/predict-batch", response_model=List[PredictionResult])
def predict_batch(data: List[HotspotInput]):
    """Batch zone prediction endpoint - processes multiple zones"""
    results = []
    for zone_data in data:
        try:
            result = process_single_prediction(zone_data)
            results.append(result)
        except Exception as e:
            # Log error but continue processing other zones
            print(f"Error processing zone {zone_data.zone_id}: {e}")
            # Optionally: skip failed zones or return error result
    
    return results

@app.get("/health")
def health_check():
    """Health check endpoint for deployment"""
    return {
        "status": "healthy",
        "model_loaded": model.model is not None
    }