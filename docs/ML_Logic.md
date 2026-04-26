### 🔮 HotspotCast (ML Model)

- Model: XGBoost Regressor  
- Objective: Predict number of emergency calls per zone  
- Input Features:
  - Environmental: AQI, PM2.5, PM10
  - Weather: Temperature, Humidity
  - Temporal: Hour, Day of Week (encoded using sin/cos)
  - Demographics: Population Density, Elderly Percentage
  - Temporal Signals : rolling_calls_7, lag_24h

- Output:
  - Predicted emergency call count (integer ≥ 0)

---

### ⚠️ RiskPulse (Rule Engine)

Rule-based scoring system that converts predictions + context into actionable risk levels.

#### Scoring Factors:

- **Air Quality (AQI > 150)** → +2  
- **High Predicted Demand (>5 calls)** → +2  
- **Elderly Population (>20%)** → +2  
- **Peak Hours (17–21)** → +1  

#### Risk Classification:

| Score | Risk Level |
|------|-----------|
| 0–1  | LOW       |
| 2–3  | MODERATE  |
| 4–5  | HIGH      |
| ≥6   | CRITICAL  |

#### Output:

- Risk Score (0–100 scale)
- Risk Class
- Human-readable reasons