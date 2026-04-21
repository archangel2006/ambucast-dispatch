def calculate_risk(data, predicted_calls):
    score = 0
    reasons = []

    # AQI impact
    if data["AQI"] > 150:
        score += 2
        reasons.append(
            f"Air quality is unhealthy (AQI {data['AQI']}), increasing respiratory emergencies."
        )

    # Demand impact
    if predicted_calls > 5:
        score += 2
        reasons.append(
            "Predicted emergency demand is above normal for this time window."
        )

    # Elderly population
    if data["elderly_pct"] > 0.2:
        score += 2
        reasons.append(
            "Higher elderly population increases vulnerability to emergencies."
        )

    # Time-based logic
    if 17 <= data["hour"] <= 21:
        score += 1
        reasons.append(
            "Evening peak hours typically see increased movement and incident rates."
        )

    # Classification
    if score >= 6:
        risk_class = "CRITICAL"
    elif score >= 4:
        risk_class = "HIGH"
    elif score >= 2:
        risk_class = "MODERATE"
    else:
        risk_class = "LOW"

    return {
        "risk_score": score * 15,  # scale to 0–100
        "risk_class": risk_class,
        "reasons": reasons
    }