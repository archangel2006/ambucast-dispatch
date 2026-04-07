from pydantic import BaseModel

class HotspotInput(BaseModel):
    aqi: float
    pm25: float
    pm10: float
    temperature: float
    humidity: float
    hour: int
    day_of_week: int
    population_density: float
    elderly_pct: float