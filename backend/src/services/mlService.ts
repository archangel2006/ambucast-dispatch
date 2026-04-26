const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000";
const ML_API_TIMEOUT = parseInt(process.env.ML_API_TIMEOUT || "5000");
const ML_API_ENABLED = process.env.ML_API_ENABLED !== "false";

interface ZoneData {
  zone_id: string;
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number;
  humidity: number;
  hour: number;
  day_of_week: number;
  population_density: number;
  elderly_pct: number;
}

interface PredictionResult {
  zone_id: string;
  predicted_calls: number;
  risk_score: number;
  risk_class: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  reasons: string[];
}

export const getPredictions = async (zones: ZoneData[]): Promise<PredictionResult[]> => {
  if (!ML_API_ENABLED) {
    console.warn("ML API is disabled");
    return zones.map(z => ({
      zone_id: z.zone_id,
      predicted_calls: 0,
      risk_score: 0,
      risk_class: "LOW" as const,
      reasons: []
    }));
  }

  try {
    console.log(`Calling ML API: ${ML_API_URL}/predict-batch with ${zones.length} zones`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ML_API_TIMEOUT);

    const response = await fetch(`${ML_API_URL}/predict-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zones),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`);
    }

    const predictions: PredictionResult[] = await response.json();
    return predictions;

  } catch (error: any) {
    console.error("ML API failed:", error.message);

    // Safe fallback
    return zones.map(z => ({
      zone_id: z.zone_id,
      predicted_calls: -1,
      risk_score: -1,
      risk_class: "CRITICAL" as const,
      reasons: ["ML API unavailable"]
    }));
  }
};

export const getPrediction = async (zone: ZoneData): Promise<PredictionResult> => {
  try {
    console.log(`Calling ML API: ${ML_API_URL}/predict for zone ${zone.zone_id}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ML_API_TIMEOUT);

    const response = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zone),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`);
    }

    const prediction: PredictionResult = await response.json();
    return prediction;

  } catch (error: any) {
    console.error(`ML API failed for zone ${zone.zone_id}:`, error.message);

    // Safe fallback (fixed)
    return {
      zone_id: zone.zone_id,
      predicted_calls: -1,
      risk_score: -1,
      risk_class: "CRITICAL",
      reasons: ["ML API unavailable"]
    };
  }
};

export const checkMLAPIHealth = async (): Promise<boolean> => {
  if (!ML_API_ENABLED) return false;

  try {
    const response = await fetch(`${ML_API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(ML_API_TIMEOUT)
    });
    return response.ok;
  } catch {
    return false;
  }
};