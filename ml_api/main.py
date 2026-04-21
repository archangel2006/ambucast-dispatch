from fastapi import FastAPI
from inference.hotspot import HotspotPredictor
from inference.riskpulse import calculate_risk
from schemas.input_schema import HotspotInput

app = FastAPI()

model = HotspotPredictor()

@app.post("/predict")
def predict(data: HotspotInput):
    input_dict = {
        "AQI": data.aqi,
        "PM2.5": data.pm25,
        "PM10": data.pm10,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "hour": data.hour,
        "day_of_week": data.day_of_week,
        "population_density": data.population_density,
        "elderly_pct": data.elderly_pct
    }

    # MODEL 1
    predicted_calls = model.predict(input_dict)

    #  MODEL 2
    risk_output = calculate_risk(input_dict, predicted_calls)

    #  FINAL RESPONSE
    return {
        "predicted_calls": predicted_calls,
        "risk_score": risk_output["risk_score"],
        "risk_class": risk_output["risk_class"],
        "reasons": risk_output["reasons"]
    }