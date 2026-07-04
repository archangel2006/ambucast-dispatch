def calculate_risk(data, predicted_calls):
    score = 0
    reasons = []

    # AQI impact
    if data["AQI"] > 200:
        score += 3
        reasons.append(
            f"Very unhealthy air quality (AQI {data['AQI']}), raising emergency risk."
        )
    elif data["AQI"] > 150:
        score += 1
        reasons.append(
            f"Unhealthy air quality (AQI {data['AQI']}), contributing to risk."
        )

    # Demand impact
    if predicted_calls > 10:
        score += 3
        reasons.append(
            "Predicted emergency demand is unusually high for this time window."
        )
    elif predicted_calls > 5:
        score += 1
        reasons.append(
            "Predicted emergency demand is above normal."
        )

    # Population density impact
    if data["population_density"] > 30000:
        score += 1
        reasons.append(
            "High population density increases emergency exposure."
        )
    elif data["population_density"] > 22000:
        score += 1
        reasons.append(
            "Above-average population density contributes to incident risk."
        )

    # Elderly population
    if data["elderly_pct"] > 0.18:
        score += 1
        reasons.append(
            "Higher elderly population increases vulnerability to emergencies."
        )

    # Time-based logic
    if 17 <= data["hour"] <= 21:
        score += 1
        reasons.append(
            "Evening peak hours typically see increased movement and incident rates."
        )

    # Classification thresholds
    if score >= 7:
        risk_class = "CRITICAL"
    elif score >= 4:
        risk_class = "HIGH"
    elif score >= 2:
        risk_class = "MODERATE"
    else:
        risk_class = "LOW"

    return {
        "risk_score": min(score * 15, 100),  # scale to 0–100
        "risk_class": risk_class,
        "reasons": reasons
    }