Hackathon Project

🚨 AmbuCast — Predictive Ambulance Intelligence System

## 📌 Overview

AmbuCast is a **smart, AI-powered ambulance deployment system** that predicts where medical emergencies are likely to occur and proactively positions ambulances to reduce response time.

Unlike traditional emergency systems that are **reactive**, AmbuCast is **predictive and data-driven**, helping save lives by ensuring ambulances are already near high-risk zones.

---

## ❗ Problem Statement

* Average ambulance response time in India: **25–35 minutes**
* Critical survival window ("Golden Hour") often missed
* Emergency systems are **reactive**, not predictive
* Poor allocation of limited ambulance resources

---

## 💡 Our Solution

AmbuCast uses **Machine Learning + Real-Time Data** to:

* Predict **future emergency hotspots**
* Assess **real-time risk levels across zones**
* Recommend **optimal ambulance placement**

---

## 🧠 System Architecture

### 🗺️ 1. HotspotCast (Demand Prediction)

* Predicts emergency call volume per zone for next 1–3 hours
* Model: **XGBoost Regressor**
* Output: Heatmap of high-demand zones

---

### 🌡️ 2. RiskPulse (Risk Analysis)

* Evaluates current risk using environmental + demographic data
* Model: **Random Forest**
* Output: Risk levels (LOW / MODERATE / HIGH / CRITICAL)
* Features:

  * AQI, PM2.5, PM10
  * Temperature, Humidity
  * Population Density
  * Elderly %

---

### 🚑 3. FleetOptimizer (Decision Engine)

* Recommends optimal ambulance repositioning
* Based on:

  * Predicted demand (HotspotCast)
  * Risk levels (RiskPulse)
* Output: Movement instructions for ambulances

---

## 📊 Dataset

We used a **hybrid dataset approach**:

* Synthetic EMS call data (to simulate real-world patterns)
* Environmental data (AQI, weather)
* Demographic features (population density, elderly %)

---

## ⚙️ Tech Stack

* **Python**
* **Pandas, NumPy**
* **Scikit-learn (Random Forest)**
* **XGBoost**
* **Streamlit (Frontend)**
* **APIs (AQI, Weather — optional/simulated)**

---

## 🚀 Features

* 📍 Zone-wise emergency prediction
* 🌡️ Real-time risk scoring
* 🚑 Ambulance tracking & allocation
* 🗺️ Interactive map visualization
* 📊 Data analytics dashboard
* ⚡ Fast and scalable ML models

---

## 🖥️ How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ambucast.git
cd ambucast
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the application

```bash
streamlit run app.py
```

---

## 📈 Model Details

### RiskPulse Model

* Type: Classification
* Algorithm: Random Forest
* Target: Risk Level (LOW / MODERATE / HIGH / CRITICAL)
* Accuracy: ~XX% (update after training)

---

## 🎯 Impact

* Reduces ambulance response time
* Improves emergency coverage
* Enhances decision-making for EMS systems
* Potential to **save thousands of lives**

---

## 🔮 Future Scope

* Integration with real EMS systems
* Reinforcement learning for fleet optimization
* Live GPS ambulance tracking
* Integration with hospital availability systems

---

## 👩‍💻 Team

* Team Jirachi
* Built for Hackathon 2026

---

