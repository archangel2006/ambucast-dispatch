# RiskPulse – Risk Assessment & Scoring Engine

## 📌 Overview

**RiskPulse** evaluates and assigns risk levels to each zone by analyzing environmental conditions, demographic factors, and predicted emergency volume. It answers: **"How severe is the emergency situation in each zone right now?"**

---

## 🎯 Purpose & Problem

### The Problem
- High emergency call volume alone doesn't tell the full story
- A zone with 12 predicted calls could have vastly different urgency depending on **why** those calls might occur
- Different risk profiles demand different response strategies

### RiskPulse Solution
- Synthesizes environmental (AQI, weather) and demographic factors
- Scores each zone on a continuous scale (0.0–1.0)
- Classifies zones into actionable risk categories (LOW, MODERATE, HIGH, CRITICAL)
- Provides **interpretable reasons** for risk classification
- Enables priority-based ambulance allocation

---

## 🏗️ Architecture & Design

### Model Type
**Rule-Based Scoring Engine with Machine Learning Feature Enhancement**

### Why Rule-Based?
| Criterion | Approach | Rationale |
|-----------|----------|-----------|
| **Explainability** | Rule-Based | Stakeholders (hospital admins, dispatch centers) need to understand *why* a zone is high-risk |
| **Interpretability** | If-Then Rules | No black box; each risk factor is visible and adjustable |
| **Adaptability** | Domain Experts | Can tune thresholds without retraining ML models |
| **Reliability** | Deterministic | Consistent results across deployments (no model variance) |
| **Speed** | <1ms | No model loading overhead; pure computation |

### Risk Score Calculation

```
Risk Score = f(Environmental Factors, Demographic Factors, Predicted Demand)

Components:
├─ Environmental Risk (40% weight):
│  ├─ Air Quality (AQI, PM2.5, PM10)
│  └─ Weather (Temperature extremes)
├─ Demographic Risk (30% weight):
│  ├─ Population Density
│  └─ Elderly Population %
└─ Demand Risk (30% weight):
   └─ Predicted Emergency Calls
```

---

## 📊 Risk Calculation Logic

### Step 1: Environmental Risk Scoring

**Air Quality Component**
```python
def air_quality_risk(aqi, pm25, pm10):
    """
    AQI Scale:
    0-50: Good (minimal respiratory emergencies)
    51-100: Moderate (some risk)
    101-150: Unhealthy for Sensitive Groups (high risk)
    151-200: Unhealthy (very high risk)
    201+: Very Unhealthy / Hazardous (critical risk)
    """
    if aqi > 300:
        return 0.9  # Critical
    elif aqi > 200:
        return 0.8  # Very High
    elif aqi > 150:
        return 0.7  # High
    elif aqi > 100:
        return 0.5  # Moderate
    else:
        return 0.2  # Low
```

**Temperature Component**
```python
def temperature_risk(temperature):
    """
    Extreme temperatures (both heat & cold) correlate with medical emergencies:
    - Heat: Heat stroke, dehydration, elderly complications
    - Cold: Hypothermia, cardiac events
    """
    if temperature > 38 or temperature < 5:
        return 0.8  # Extreme
    elif temperature > 35 or temperature < 10:
        return 0.6  # High
    else:
        return 0.3  # Moderate/Low
```

**Combined Environmental Risk**
```python
environmental_risk = (
    0.5 * air_quality_risk(aqi, pm25, pm10) +
    0.5 * temperature_risk(temperature)
)
# Result: 0.0–1.0 scale
```

### Step 2: Demographic Risk Scoring

```python
def demographic_risk(population_density, elderly_pct):
    """
    Higher density = more accidents
    Higher elderly % = more medical emergencies
    """
    density_component = min(population_density / 10000, 1.0)  # Normalize to 0-1
    elderly_component = min(elderly_pct / 20, 1.0)  # Assume 20% is maximum
    
    demographic_risk = (
        0.6 * density_component +
        0.4 * elderly_component
    )
    return demographic_risk
```

### Step 3: Demand Risk Scoring

```python
def demand_risk(predicted_calls):
    """
    More predicted calls = higher urgency
    Normalize to 0-1 scale (assuming max ~50 calls/hour)
    """
    return min(predicted_calls / 50, 1.0)
```

### Step 4: Composite Risk Score

```python
def calculate_risk_score(aqi, pm25, pm10, temperature, humidity,
                         population_density, elderly_pct, predicted_calls):
    
    environmental = environmental_risk(aqi, pm25, pm10, temperature)
    demographic = demographic_risk(population_density, elderly_pct)
    demand = demand_risk(predicted_calls)
    
    # Weighted average
    risk_score = (
        0.40 * environmental +
        0.30 * demographic +
        0.30 * demand
    )
    
    # Normalize to 0-1
    return min(max(risk_score, 0.0), 1.0)
```

---

## 🎯 Risk Classification

### Risk Classes & Thresholds

```python
def classify_risk(risk_score):
    """
    Convert continuous score (0-1) to categorical risk level
    """
    if risk_score >= 0.75:
        return "CRITICAL"
    elif risk_score >= 0.50:
        return "HIGH"
    elif risk_score >= 0.25:
        return "MODERATE"
    else:
        return "LOW"
```

### Risk Class Definitions & Actions

| Risk Class | Score Range | Emergency Type | Allocation Strategy | Ambulance Readiness |
|-----------|------------|-----------------|------------------|-------------------|
| **CRITICAL** | 0.75–1.0 | Life-threatening emergencies expected; extreme environmental conditions + high density + predicted demand | Deploy multiple ambulances; pre-position advanced life support units | Maximum readiness; zero standby |
| **HIGH** | 0.50–0.75 | Significant emergencies likely; poor environmental conditions or high demographic risk + moderate demand | Allocate ambulances proactively; reduced response distance | High readiness; minimal standby |
| **MODERATE** | 0.25–0.50 | Some emergencies likely; stable environmental conditions but high density or demand | Standard allocation; maintain normal coverage | Standard readiness; some standby units |
| **LOW** | 0.0–0.25 | Few emergencies expected; good environmental conditions + lower risk factors | Minimal allocation; can support other zones if needed | Lower readiness; available for redistribution |

---

## 📋 Risk Scoring Examples

### Example 1: High AQI Urban Zone (CRITICAL)
```python
# Input Features
aqi = 250              # Very Unhealthy
pm25 = 85
pm10 = 120
temperature = 36      # Very Hot
humidity = 45
population_density = 12000  # Dense urban
elderly_pct = 18
predicted_calls = 22  # High demand

# Calculations
environmental = 0.4 * 0.85 (AQI) + 0.6 * 0.75 (Temp) = 0.79
demographic = 0.6 * 1.0 (density) + 0.4 * 0.9 (elderly) = 0.96
demand = 22 / 50 = 0.44

risk_score = 0.40 * 0.79 + 0.30 * 0.96 + 0.30 * 0.44 = 0.72
classification = "HIGH"

reasons = [
    "High AQI (250) - respiratory emergencies likely",
    "Extreme heat (36°C) - heat-related illnesses",
    "High population density (12,000/km²)",
    "Significant elderly population (18%)",
    "High predicted demand (22 calls/hour)"
]
```

### Example 2: Suburban Moderate Risk Zone (MODERATE)
```python
# Input Features
aqi = 95               # Moderate
pm25 = 28
pm10 = 40
temperature = 28      # Comfortable
humidity = 60
population_density = 4500  # Suburban
elderly_pct = 12
predicted_calls = 8   # Moderate demand

# Calculations
environmental = 0.4 * 0.45 (AQI) + 0.6 * 0.3 (Temp) = 0.36
demographic = 0.6 * 0.45 (density) + 0.4 * 0.6 (elderly) = 0.51
demand = 8 / 50 = 0.16

risk_score = 0.40 * 0.36 + 0.30 * 0.51 + 0.30 * 0.16 = 0.34
classification = "MODERATE"

reasons = [
    "Moderate AQI conditions",
    "Comfortable temperature",
    "Moderate population density",
    "Stable demographic profile"
]
```

### Example 3: Rural Low Risk Zone (LOW)
```python
# Input Features
aqi = 45               # Good
pm25 = 12
pm10 = 18
temperature = 22      # Mild
humidity = 55
population_density = 800  # Rural
elderly_pct = 8
predicted_calls = 2   # Low demand

# Calculations
environmental = 0.4 * 0.15 (AQI) + 0.6 * 0.2 (Temp) = 0.18
demographic = 0.6 * 0.08 (density) + 0.4 * 0.4 (elderly) = 0.208
demand = 2 / 50 = 0.04

risk_score = 0.40 * 0.18 + 0.30 * 0.208 + 0.30 * 0.04 = 0.13
classification = "LOW"

reasons = [
    "Good air quality",
    "Mild temperature conditions",
    "Low population density",
    "Low emergency demand predicted"
]
```

---

## 🔄 Data Flow: How RiskPulse Integrates

```
┌──────────────────────────────────┐
│ HotspotCast Model Output          │
│ ├─ zone_id                        │
│ └─ predicted_calls                │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ RiskPulse Processing              │
│ ├─ Calculate environmental risk   │
│ ├─ Calculate demographic risk     │
│ ├─ Calculate demand risk          │
│ ├─ Compute composite score        │
│ ├─ Classify (LOW/MOD/HIGH/CRIT)  │
│ └─ Generate explanations          │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ RiskPulse Output                  │
│ ├─ risk_score (0.0-1.0)          │
│ ├─ risk_class (enum)              │
│ └─ reasons (list of strings)      │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│ Downstream Usage                  │
│ ├─ Allocation Engine              │
│ ├─ Database Storage               │
│ └─ Frontend Dashboard             │
└──────────────────────────────────┘
```

---

## 🔌 FastAPI Integration

### Code Implementation

```python
# ml_api/inference/riskpulse.py

def calculate_risk(input_dict: dict, predicted_calls: int) -> dict:
    """
    Calculate risk score and classification for a zone
    """
    aqi = input_dict["AQI"]
    pm25 = input_dict["PM2.5"]
    pm10 = input_dict["PM10"]
    temperature = input_dict["temperature"]
    humidity = input_dict["humidity"]
    population_density = input_dict["population_density"]
    elderly_pct = input_dict["elderly_pct"]
    
    # Calculate risk components
    environmental = calculate_environmental_risk(aqi, pm25, pm10, temperature)
    demographic = calculate_demographic_risk(population_density, elderly_pct)
    demand = calculate_demand_risk(predicted_calls)
    
    # Composite risk score
    risk_score = (
        0.40 * environmental +
        0.30 * demographic +
        0.30 * demand
    )
    
    # Classification
    risk_class = classify_risk(risk_score)
    
    # Generate explanations
    reasons = generate_reasons(aqi, temperature, population_density, elderly_pct, 
                               predicted_calls, risk_class)
    
    return {
        "risk_score": round(risk_score, 2),
        "risk_class": risk_class,
        "reasons": reasons
    }

def generate_reasons(aqi, temp, density, elderly, calls, risk_class) -> list:
    """Generate human-readable explanation for risk classification"""
    reasons = []
    
    if aqi > 150:
        reasons.append(f"Poor air quality (AQI: {aqi})")
    if temp > 35 or temp < 10:
        reasons.append(f"Extreme temperature ({temp}°C)")
    if density > 8000:
        reasons.append(f"High population density ({density}/km²)")
    if elderly > 15:
        reasons.append(f"Significant elderly population ({elderly}%)")
    if calls > 15:
        reasons.append(f"High predicted demand ({calls} calls/hour)")
    
    return reasons if reasons else ["Standard conditions"]
```

### Response Example

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

---

## 🎓 Interview Talking Points

### On Design Philosophy
> "I chose rule-based scoring over a machine learning classifier because stakeholders – hospital administrators, dispatch centers – need to understand *why* a zone is high-risk. With rule-based scoring, every decision is transparent and adjustable. If a hospital believes temperature thresholds should change, we can tune them immediately without retraining."

### On Composite Scoring
> "The risk score synthesizes three independent dimensions: environment (40%), demographics (30%), and demand (30%). This isn't arbitrary – it reflects the actual drivers of emergency severity. Environmental factors (AQI, heat) cause health crises; demographics determine population vulnerability; and demand volume determines ambulance saturation."

### On Interpretability
> "Each zone gets not just a score, but *reasons* for that score. This is crucial for explaining decisions to stakeholders. Instead of 'Zone X is HIGH risk,' we say 'Zone X is HIGH risk because: high AQI (165), high density (8,500/km²), and significant elderly population (12.5%).' That builds trust."

### On Real-time Adaptability
> "The rule-based approach means we can adjust thresholds in real-time based on dispatch center feedback. If we're seeing more cardiac events than predicted, we can increase the elderly population weight. If air quality suddenly becomes a major factor, we adjust thresholds dynamically – no model retraining needed."

---

## 📊 Metrics & Monitoring

### Key Performance Indicators

| KPI | Target | Monitoring |
|-----|--------|-----------|
| **Risk Class Distribution** | ~60% LOW, ~25% MODERATE, ~12% HIGH, ~3% CRITICAL | Check for balance; alert if skewed |
| **Reasons Accuracy** | 95%+ alignment with dispatch feedback | Validate against historical data |
| **Computation Latency** | <1ms per zone | Monitor for degradation |
| **Threshold Stability** | No more than quarterly adjustments | Track when adjustments needed |
| **False Positive Rate** | <10% (zones marked HIGH but few emergencies) | Validate predictions vs. outcomes |

---

## 🚀 Configuration & Customization

### Adjustable Parameters

```python
# Risk calculation weights (can be tuned)
ENVIRONMENTAL_WEIGHT = 0.40
DEMOGRAPHIC_WEIGHT = 0.30
DEMAND_WEIGHT = 0.30

# Risk classification thresholds
CRITICAL_THRESHOLD = 0.75
HIGH_THRESHOLD = 0.50
MODERATE_THRESHOLD = 0.25

# Feature thresholds (domain-specific)
AQI_CRITICAL = 300
AQI_HIGH = 200
TEMP_EXTREME = 38
POPULATION_DENSE = 10000
ELDERLY_HIGH = 20
CALLS_HIGH = 30
```

### How to Adjust (For Stakeholders)
```yaml
Configuration Scenario:
- Dispatch center reports: "Too many false CRITICAL alerts; affecting crew morale"
- Action: Increase CRITICAL_THRESHOLD from 0.75 to 0.80
- Impact: Fewer zones classified as CRITICAL; only the truly critical zones trigger maximum response
- Monitor: Track if actual emergencies in CRITICAL zones decrease
```

---

## 📝 Code Reference

### Python Code
- **Risk Calculation**: `ml_api/inference/riskpulse.py`
- **Integration Point**: `ml_api/main.py` (called from `/predict` endpoint)

### Backend Usage
- **Allocation Service**: `backend/src/modules/allocation/allocation.service.ts` (uses risk_class for prioritization)
- **Database**: `backend/prisma/schema.prisma` (stores risk_score and risk_class)

---

## 🔮 Future Enhancements

| Enhancement | Impact | Benefits |
|-------------|--------|----------|
| **Dynamic Thresholds** | Adjust weights based on season/time-of-day | Better accuracy across varying conditions |
| **Machine Learning Fallback** | Classify risk using ensemble methods if needed | Higher accuracy without losing interpretability |
| **Feedback Loops** | Compare predictions vs. actual emergencies; adjust rules | Continuous improvement |
| **Fairness Audits** | Check for geographic/socioeconomic bias in risk scores | Equitable emergency response |
| **Uncertainty Quantification** | Return confidence intervals alongside risk scores | Stakeholders understand prediction reliability |
| **Real-time Calibration** | Use historical dispatch data to auto-tune thresholds | Self-improving system |
