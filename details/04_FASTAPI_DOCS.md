# FastAPI – ML Service Architecture & Integration

## 📌 Overview

**FastAPI** is the Python microservice that hosts and exposes the machine learning models for real-time inference. It provides RESTful endpoints for HotspotCast (demand prediction) and RiskPulse (risk scoring) accessible to the Node.js backend.

---

## 🎯 Why FastAPI?

| Criterion | FastAPI | Alternatives | Why FastAPI Wins |
|-----------|---------|--------------|-----------------|
| **Speed** | Very fast (async/await) | Django (slower), Flask (slower) | Fastest Python framework; critical for real-time |
| **Type Safety** | Built-in (Pydantic) | Manual validation | Automatic input validation reduces bugs |
| **Documentation** | Auto-generated (Swagger) | Manual | Stakeholders can test endpoints via UI |
| **Async Support** | Native | Requires extra setup | Handle concurrent requests without threads |
| **Deployment** | Lightweight (ASGI) | WSGI for Django | Easy containerization; scales horizontally |
| **Developer Experience** | Excellent | Good | Modern Python syntax; fast to iterate |

---

## 🏗️ Architecture

### FastAPI Service Structure

```
ml_api/
├─ main.py                          # App entry point; endpoints
├─ requirements.txt                 # Python dependencies
├─ inference/
│  ├─ hotspot.py                   # HotspotCast model wrapper
│  └─ riskpulse.py                 # RiskPulse scoring engine
└─ schemas/
   └─ input_schema.py              # Pydantic models (validation)
```

### Startup Flow

```python
# ml_api/main.py

from fastapi import FastAPI
from inference.hotspot import HotspotPredictor
from inference.riskpulse import calculate_risk
from schemas.input_schema import HotspotInput, PredictionResult
import numpy as np
from typing import List

# Initialize FastAPI app
app = FastAPI()

# Load ML models on startup
model = HotspotPredictor()  # Loads XGBoost model from disk

@app.get("/")
def root():
    return {"message": "AmbuCast ML API running"}

@app.get("/health")
def health_check():
    """Endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "model_loaded": model.model is not None
    }
```

---

## 🔌 API Endpoints

### 1. Health Check Endpoint

**Purpose**: Verify service is running and model is loaded

**Endpoint**: `GET /health`

**Response** (200 OK)
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

**Usage**: Deployment monitoring, load balancer health checks

---

### 2. Root Endpoint

**Purpose**: Simple connectivity test

**Endpoint**: `GET /`

**Response** (200 OK)
```json
{
  "message": "AmbuCast ML API running"
}
```

---

### 3. Single Zone Prediction

**Purpose**: Predict emergency demand and risk for ONE zone

**Endpoint**: `POST /predict`

**Request Schema** (`HotspotInput`)
```python
class HotspotInput(BaseModel):
    zone_id: str
    aqi: int                    # Air Quality Index
    pm25: float                 # PM2.5 particulates
    pm10: float                 # PM10 particulates
    temperature: float          # Celsius
    humidity: float             # Percentage
    hour: int                   # 0-23
    day_of_week: int           # 0-6 (Monday-Sunday)
    population_density: int     # People per km²
    elderly_pct: float         # Percentage
```

**Request Example**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": "Z1",
    "aqi": 165,
    "pm25": 42.5,
    "pm10": 58.3,
    "temperature": 32.5,
    "humidity": 68,
    "hour": 14,
    "day_of_week": 3,
    "population_density": 8500,
    "elderly_pct": 12.5
  }'
```

**Response Schema** (`PredictionResult`)
```python
class PredictionResult(BaseModel):
    zone_id: str
    predicted_calls: int        # Expected emergency calls
    risk_score: float           # 0.0-1.0
    risk_class: str            # "LOW", "MODERATE", "HIGH", "CRITICAL"
    reasons: List[str]         # Human-readable explanation
```

**Response Example** (200 OK)
```json
{
  "zone_id": "Z1",
  "predicted_calls": 12,
  "risk_score": 0.72,
  "risk_class": "HIGH",
  "reasons": [
    "High AQI (165) - respiratory emergencies likely",
    "High population density (8,500/km²)",
    "Significant elderly population (12.5%)"
  ]
}
```

**Latency**: ~15–20ms

---

### 4. Batch Zone Prediction ⭐ (Most Important)

**Purpose**: Predict for MULTIPLE zones in ONE request (more efficient)

**Endpoint**: `POST /predict-batch`

**Request** (Array of `HotspotInput`)
```json
[
  {
    "zone_id": "Z1",
    "aqi": 165,
    "pm25": 42.5,
    "pm10": 58.3,
    "temperature": 32.5,
    "humidity": 68,
    "hour": 14,
    "day_of_week": 3,
    "population_density": 8500,
    "elderly_pct": 12.5
  },
  {
    "zone_id": "Z2",
    "aqi": 120,
    "pm25": 30.2,
    "pm10": 42.1,
    "temperature": 31.0,
    "humidity": 72,
    "hour": 14,
    "day_of_week": 3,
    "population_density": 6200,
    "elderly_pct": 9.8
  }
]
```

**Response** (Array of `PredictionResult`)
```json
[
  {
    "zone_id": "Z1",
    "predicted_calls": 12,
    "risk_score": 0.72,
    "risk_class": "HIGH",
    "reasons": [...]
  },
  {
    "zone_id": "Z2",
    "predicted_calls": 8,
    "risk_score": 0.45,
    "risk_class": "MODERATE",
    "reasons": [...]
  }
]
```

**Latency**:
- 2 zones: ~20ms
- 10 zones: ~60ms
- 50 zones: ~250ms

**Why Batch Over Sequential Calls?**
```
Sequential calls (50 zones):
50 zones × 15ms per call × HTTP overhead = 1000ms+ total

Batch call (50 zones):
50 zones × 250ms in single request = 250ms total

Efficiency gain: 4x faster!
```

---

## 📊 Implementation Details

### Input Validation (Pydantic)

```python
# ml_api/schemas/input_schema.py

from pydantic import BaseModel, Field, validator
from typing import List

class HotspotInput(BaseModel):
    zone_id: str
    aqi: int = Field(..., ge=0, le=500, description="Air Quality Index")
    pm25: float = Field(..., ge=0, description="PM2.5 (µg/m³)")
    pm10: float = Field(..., ge=0, description="PM10 (µg/m³)")
    temperature: float = Field(..., ge=-50, le=60, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    hour: int = Field(..., ge=0, le=23, description="Hour of day")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week (0=Mon)")
    population_density: int = Field(..., ge=0, description="People per km²")
    elderly_pct: float = Field(..., ge=0, le=100, description="Elderly population %")
    
    @validator('zone_id')
    def zone_id_not_empty(cls, v):
        if not v.strip():
            raise ValueError('zone_id cannot be empty')
        return v

class PredictionResult(BaseModel):
    zone_id: str
    predicted_calls: int
    risk_score: float
    risk_class: str
    reasons: List[str]
```

**Benefits**:
- ✅ Automatic type checking (rejects invalid types)
- ✅ Range validation (prevents impossible values)
- ✅ Required fields enforcement
- ✅ Automatic JSON serialization/deserialization
- ✅ Clear error messages if validation fails

---

### Model Loading & Inference

```python
# ml_api/inference/hotspot.py

import joblib
import numpy as np
from pathlib import Path

class HotspotPredictor:
    def __init__(self, model_path="models/hotspot_model.pkl"):
        """Load XGBoost model on initialization"""
        try:
            self.model = joblib.load(model_path)
            print(f"✓ Loaded HotspotCast model from {model_path}")
        except FileNotFoundError:
            print(f"✗ Model not found at {model_path}")
            self.model = None
    
    def predict(self, input_dict: dict) -> float:
        """
        Make prediction for a single zone
        Input: dictionary with feature values
        Output: predicted call volume (float)
        """
        if not self.model:
            raise RuntimeError("Model not loaded")
        
        # Feature order must match training order
        features = np.array([
            input_dict["AQI"],
            input_dict["PM2.5"],
            input_dict["PM10"],
            input_dict["temperature"],
            input_dict["humidity"],
            input_dict["hour"],
            input_dict["day_of_week"],
            input_dict["population_density"],
            input_dict["elderly_pct"]
        ]).reshape(1, -1)
        
        # Make prediction
        prediction = self.model.predict(features)[0]
        
        # Ensure non-negative (calls cannot be negative)
        return max(prediction, 0)
```

---

### Error Handling

```python
@app.post("/predict-batch", response_model=List[PredictionResult])
def predict_batch(data: List[HotspotInput]):
    """Batch prediction with graceful error handling"""
    results = []
    
    for zone_data in data:
        try:
            # Process single zone
            result = process_single_prediction(zone_data)
            results.append(result)
        except Exception as e:
            # Log error but continue processing other zones
            print(f"Error processing zone {zone_data.zone_id}: {str(e)}")
            
            # Option 1: Skip this zone
            # continue
            
            # Option 2: Return error result (better for debugging)
            results.append(PredictionResult(
                zone_id=zone_data.zone_id,
                predicted_calls=0,
                risk_score=0.0,
                risk_class="ERROR",
                reasons=[f"Prediction failed: {str(e)}"]
            ))
    
    return results
```

**Why Continue on Error?**
- If 1 out of 50 zones fails, we still get 49 valid predictions
- Deployment doesn't crash; gracefully degrades
- Backend can retry failed zones or use cached values

---

## 🔄 Integration with Node.js Backend

### Backend Call to FastAPI

```typescript
// backend/src/services/mlService.ts

import axios from "axios";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";

export const getPredictions = async (zones: any[]) => {
    try {
        // Call FastAPI batch endpoint
        const response = await axios.post(
            `${ML_API_URL}/predict-batch`,
            zones,  // Array of HotspotInput objects
            {
                timeout: 10000,  // 10 second timeout
                headers: { "Content-Type": "application/json" }
            }
        );
        
        console.log("ML API returned predictions for", response.data.length, "zones");
        return response.data;  // Array of PredictionResult objects
    } catch (error) {
        console.error("Error calling ML API:", error.message);
        throw error;
    }
};
```

### Pipeline Integration

```typescript
// backend/src/services/pipeline.ts

export const buildZonePayloads = async () => {
    const time = getTimeData();
    const entries = Object.entries(zones);

    // Step 1: Build zone data with air & weather
    const results = await Promise.all(
        entries.map(async ([zone_id, zone]: any) => {
            const [air, weather] = await Promise.all([
                getAirData(zone.lat, zone.lng),
                getWeatherData(zone.lat, zone.lng)
            ]);

            return {
                zone_id,
                ...air,
                ...weather,
                ...time,
                population_density: zone.population_density,
                elderly_pct: zone.elderly_pct
            };
        })
    );

    // Step 2: Call FastAPI for predictions
    try {
        console.log("Calling ML API for batch predictions...");
        const predictions = await getPredictions(results);

        // Step 3: Merge predictions with zone data
        const enrichedResults = results.map(zone => {
            const prediction = predictions.find(p => p.zone_id === zone.zone_id);
            return {
                ...zone,
                ...(prediction || {
                    predicted_calls: 0,
                    risk_score: 0,
                    risk_class: "LOW",
                    reasons: ["No prediction available"]
                })
            };
        });

        return enrichedResults;
    } catch (error) {
        console.error("ML API error, returning zone data only:", error);
        return results;  // Graceful fallback
    }
};
```

---

## 🚀 Deployment & Scaling

### Single Instance Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Runs on**: `http://localhost:8000`
**Documentation UI**: `http://localhost:8000/docs` (Swagger)
**Alternative UI**: `http://localhost:8000/redoc` (ReDoc)

### Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Kubernetes Deployment (Future)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ambucast-ml-api
spec:
  replicas: 3  # Multiple instances for load balancing
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      containers:
      - name: ml-api
        image: ambucast-ml-api:latest
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## 📈 Performance Optimization

### Model Loading Strategy

```python
# Option 1: Load once at startup (current)
model = HotspotPredictor()  # In ml_api/main.py

# Option 2: Lazy loading (load on first request)
@app.on_event("startup")
async def startup_event():
    global model
    model = HotspotPredictor()
    print("Model loaded on startup")
```

### Batch Request Optimization

| Strategy | Latency (50 zones) | Throughput |
|----------|------------------|-----------|
| Sequential calls | 750ms (50 × 15ms) | 67 zones/sec |
| Single batch call | 250ms | 200 zones/sec |
| Batch + caching | 0-250ms | 500+ zones/sec |

### Caching Strategy

```python
from functools import lru_cache
from datetime import datetime, timedelta

class PredictionCache:
    def __init__(self, ttl_minutes=5):
        self.cache = {}
        self.ttl = timedelta(minutes=ttl_minutes)
    
    def get(self, zone_id, feature_hash):
        """Get cached prediction if not expired"""
        if zone_id in self.cache:
            cached_result, timestamp = self.cache[zone_id]
            if datetime.now() - timestamp < self.ttl:
                return cached_result
        return None
    
    def set(self, zone_id, result):
        """Cache prediction with timestamp"""
        self.cache[zone_id] = (result, datetime.now())

cache = PredictionCache(ttl_minutes=5)
```

---

## 🎓 Interview Talking Points

### On Framework Choice
> "I chose FastAPI because it's the fastest Python framework for ML model serving, with built-in async support for concurrent requests. Plus, it auto-generates interactive API documentation (Swagger UI), which was invaluable for debugging and team collaboration."

### On Batch Processing
> "The /predict-batch endpoint is crucial for production. Making 50 individual HTTP calls to predict each zone would take 750ms+ with network latency. A single batch call processes all 50 zones in 250ms – 3x faster and more efficient."

### On Error Handling
> "If one zone's prediction fails, the system continues with the others instead of crashing. The pipeline has graceful degradation – if the ML API is down, the backend still returns zone data, allowing the frontend to show something useful while we fix the issue."

### On Validation
> "Pydantic models automatically validate inputs. If someone sends invalid AQI value (e.g., 1000 instead of 500), the API rejects it immediately with a clear error message. This prevents garbage input from reaching the model."

---

## 📊 Monitoring & Logging

### Request Logging

```python
from fastapi import Request
import time

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    
    print(f"[{request.method}] {request.url.path} "
          f"- Status: {response.status_code} "
          f"- Duration: {duration*1000:.1f}ms")
    
    return response
```

### Key Metrics to Monitor
- **Response Time**: Per-endpoint latency
- **Error Rate**: % of failed predictions
- **Throughput**: Zones predicted per minute
- **Model Staleness**: How long since last retraining
- **Memory Usage**: ML model size in memory

---

## 🔮 Future Enhancements

| Enhancement | Benefit | Timeline |
|-------------|---------|----------|
| **Async Model Inference** | Non-blocking predictions for truly concurrent requests | Q2 2026 |
| **Model Versioning** | A/B test new models without downtime | Q2 2026 |
| **Caching Layer** | Redis for zone prediction caching | Q2 2026 |
| **Rate Limiting** | Prevent backend from overwhelming ML API | Q3 2026 |
| **GraphQL API** | Flexible querying (alternative to REST) | Q3 2026 |
| **Model Monitoring** | Track prediction drift over time | Q3 2026 |
| **Ensemble Models** | Combine multiple models for better accuracy | Q4 2026 |

---

## 📝 Code Reference

### API Implementation
- **Main Service**: `ml_api/main.py`
- **Inference**: `ml_api/inference/`
- **Schemas**: `ml_api/schemas/input_schema.py`

### Backend Integration
- **ML Service**: `backend/src/services/mlService.ts`
- **Pipeline**: `backend/src/services/pipeline.ts`

### Testing
- **Try it out**: `http://localhost:8000/docs` (after starting FastAPI)
