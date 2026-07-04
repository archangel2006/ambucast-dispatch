# 🚑 AmbuCast — Predictive Ambulance Dispatch System

AmbuCast is an **AI-powered ambulance deployment and emergency dispatch platform** designed to predict future medical emergencies and proactively position ambulance fleets. By shifting the emergency response paradigm from **reactive** to **predictive**, AmbuCast helps ensure ambulances are stationed near predicted hotspots before calls occur, saving crucial minutes during the "Golden Hour".

---

### The Problem
* **Delayed Response**: The average ambulance response time in dense urban areas like India is **25–35 minutes**.
* **Missed Window**: Patients miss the critical survival window ("Golden Hour") due to traffic and poor vehicle placement.
* **Static Staging**: Ambulances are parked statically at hospitals rather than dynamically relocated to match shifting demand patterns.

### The Solution
AmbuCast integrates live weather forecasts, air quality indices, demographic metrics, and historical logs into a predictive pipeline to:
* 🔮 **Forecast future emergency hotspots** up to 3 hours in advance.
* 🌡️ **Score real-time health risks** across defined zones.
* 🚑 **Recommend optimal fleet allocation** to minimize geographic distance to expected calls.

## 📊 System Architecture

```text
+-----------------------------------------------------------------------------------+
|                            PRESENTATION LAYER (React SPA)                         |
|                                                                                   |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  | Operations Control  |   | Leaflet Interactive |   | Recharts Operational   |  |
|  | Dashboard Dashboard |   | Incident Map Layer  |   | Analytics & Logs UI     |  |
|  +---------------------+   +---------------------+   +-------------------------+  |
+---------------------------------------+-------------------------------------------+
                                        |
                         WebSockets     | REST Calls
                         (realtime)     | (JSON)
                                        v
+-----------------------------------------------------------------------------------+
|                         INTEGRATION & SERVICE LAYER (Express)                     |
|                                                                                   |
|   +-----------------------+   +-----------------------+   +-------------------+   |
|   | Socket.IO Broadcast   |   | REST Router & APIs    |   | Fleet Optimizer   |   |
|   | Server (State Sync)   |   | Controllers / Handlers|   | Allocation Engine |   |
|   +-----------------------+   +-----------+-----------+   +---------+---------+   |
+-------------------------------------------|-------------------------|-------------+
                                            |                         |
                                            | JSON Payload            | Prisma ORM
                                            v (predict-batch)         v (Read/Write)
+-------------------------------------------+-----------+   +---------+-------------+
|               MODEL INFERENCE LAYER (FastAPI)         |   |   PERSISTENCE LAYER   |
|                                                       |   |                       |
|   +-------------------+       +-------------------+   |   |   +---------------+   |
|   | XGBoost Predictor |       | RiskPulse Rules   |   |   |   | PostgreSQL DB |   |
|   | (HotspotCast Model| ----> | (LOW to CRITICAL  |   |   |   | (Fleet & Logs)|   |
|   |  - hotspotcast.pkl|       |  Classification)  |   |   |   +---------------+   |
|   +-------------------+       +-------------------+   |   +-----------------------+
+---------------------+---------------------------------+
                      |
                      | 1. Lat/Lng Inputs
                      v
+---------------------++--------------------------------+
|                     EXTERNAL DATA LAYER               |
|                                                       |
|   +-----------------------------------------------+   |
|   |      OpenWeatherMap API Services              |   |
|   |   - Weather API (Temp, Humidity)              |   |
|   |   - Air Pollution API (AQI, PM2.5, PM10)      |   |
|   +-----------------------------------------------+   |
+-------------------------------------------------------+
```

1. **HotspotCast (Demand Prediction)**: An **XGBoost Regressor** that predicts the expected volume of emergency calls per zone for the next hour based on weather, air quality index (AQI), day/time, and zone demographics.
2. **RiskPulse (Risk Engine)**: Evaluates live conditions against clinical risk factors (e.g., AQI > 150, elderly population %) to categorize each zone's risk level (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).
3. **FleetOptimizer (Allocation)**: A dispatch solver that matches available/moving ambulances to predicted hotspots using distance matrices and zone priorities.

---

## 🎨 Key Features & Pages

The client application (`new-frontend`) delivers a premium, highly responsive real-time dispatch command center:

1. **Operations Dashboard**: General KPI metrics, active fleet statuses, system alert counters, and comparative charts of predicted vs. active calls.
2. **Live Incident Map**: An interactive Leaflet map rendering real-time ambulance coordinates, active status indicators (Available, Busy, Moving), and zone heatmaps.
3. **Hotspots Analyst**: Chronological view of predicted demand, population density mapping, and air quality risk warnings.
4. **Fleet Management**: Quick-view controls to check driver status, vehicle configurations, and update coordinates.
5. **Risk Assessment**: Historical risk log charts and predictive reasons (e.g., peak evening hours, high PM2.5 concentrations).
6. **Analytics Engine**: Historical performance analysis, multi-axis charts comparing response times, and target metrics.

---

## 🧠 Machine Learning

The predictive power of AmbuCast relies on two core models working in sequence inside the FastAPI `ml_api` service:

### 1. HotspotCast (XGBoost Regressor)
An **XGBoost Regressor** trained on historical incident call sheets, temporal factors, and environmental records.
* **Input Features**:
  * *Environmental*: AQI, PM2.5, PM10
  * *Weather*: Temperature, Humidity
  * *Temporal*: Hour (sine/cosine encoded), Day of Week (sine/cosine encoded)
  * *Demographics*: Population density, Elderly population percentage
  * *Temporal Signals*: 7-day rolling calls average, 24-hour lag demand
* **Output**: Predicted emergency call volume per zone.

### 2. RiskPulse (Rule-Based Clinical Scoring)
Translates predicted demand and environmental factors into clinical risk scores:
* **Air Quality Penalty**: AQI > 150 (+1 score), AQI > 200 (+3 score)
* **Demand Penalty**: Predicted calls > 5 (+1 score), Predicted calls > 10 (+3 score)
* **Vulnerable Population**: Elderly population > 18% (+1 score)
* **Peak Hour Peak**: 5 PM to 9 PM (+1 score)
* **Risk Class Translation**:
  * `0 - 1` -> **LOW**
  * `2 - 3` -> **MODERATE**
  * `4 - 6` -> **HIGH**
  * `≥ 7`   -> **CRITICAL**

### 3. FleetOptimizer (Allocation Solver)
Calculates distance matrices using the Haversine formula between all active ambulances and active hotspots, prioritizing **CRITICAL** and **HIGH** risk zones first to assign the closest available vehicle.

---

## ⚙️ Technology Stack

| Layer | Technologies & Tools | Description / Role |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite, TypeScript, Tailwind CSS, Recharts, Leaflet, Zustand | Interactive, real-time map dashboard & analytical metrics |
| **Backend API** | Node.js, Express, TypeScript, Socket.io, Prisma ORM | Dispatch orchestration, external data integration, socket event pub/sub |
| **ML API** | Python 3.11, FastAPI, Uvicorn, XGBoost, Scikit-learn, Pandas, Joblib | Model ingestion and predictive inference services |
| **Database** | PostgreSQL | Persistent state storage for fleets and log tracking |

---

## 🚀 Local Run and Setup Instructions

### 🐳 Option A: Using Docker (Recommended)

Run all 4 services (PostgreSQL, Backend API, ML API, Frontend SPA) with a single command.

#### Step 1 — Start Docker Desktop
Open Docker Desktop from your Start menu or taskbar. Wait until you see the green **"Engine running"** indicator.

#### Step 2 — Set Up Configuration
Ensure you have a `.env` file at the root of the repository with your OpenWeather API key:
```env
OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

#### Step 3 — Run everything
Build and start the containers:
```bash
docker-compose up --build
```

Once up, the services will be running on:
* **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
* **Backend API**: [http://localhost:3001](http://localhost:3001)
* **ML API**: [http://localhost:8000](http://localhost:8000)
* **PostgreSQL Database**: `localhost:5432`

#### Step 4 — Seed the Database (First Run Only)
While the containers are running, visit the following URLs in your browser to load demo ambulances and prediction zones into the database:
* [http://localhost:3001/api/ambulances/seed](http://localhost:3001/api/ambulances/seed)
* [http://localhost:3001/api/hotspots/seed](http://localhost:3001/api/hotspots/seed)

---

### 🛠️ Option B: Manual Setup (No Docker required)

To run without docker-compose, open **4 separate terminal windows** and execute the commands below:

#### Terminal 1: PostgreSQL Database
Run a local Postgres instance (using the postgres image in docker-compose):
```bash
docker-compose up postgres
```

#### Terminal 2: Python ML API
Configure environment and run FastAPI:
```bash
cd ml_api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Terminal 3: Node.js Backend API
Install dependencies, generate the Prisma Client, run migrations, and start the development server:
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### Terminal 4: Frontend Client
Start the Vite frontend development server:
```bash
cd new-frontend
npm install
npm run dev
```
* The UI dashboard will open automatically at [http://localhost:5173](http://localhost:5173).

---

## 📁 Repository Structure

```
├── backend/             # Express.js, TypeScript, Socket.io, and Prisma ORM
├── ml_api/              # FastAPI, XGBoost prediction service, and .pkl model
├── new-frontend/        # React, Vite, Tailwind CSS, Leaflet Maps, and Recharts
├── docs/                # Project design and technical details
└── docker-compose.yml   # Multi-service container manager
```
