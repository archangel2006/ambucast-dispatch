from pydantic import BaseModel
from typing import List

class HotspotInput(BaseModel):
    zone_id: str 
    aqi: float
    pm25: float
    pm10: float
    temperature: float
    humidity: float
    hour: int
    day_of_week: int
    population_density: float
    elderly_pct: float


class PredictionResult(BaseModel):
    """Response model for a single zone prediction"""
    zone_id: str
    predicted_calls: int
    risk_score: float
    risk_class: str
    reasons: List[str]