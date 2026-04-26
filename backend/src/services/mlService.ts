/**
 * ML API Service
 * Handles communication with FastAPI ML model server
 */

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

/**
 * Get predictions for a batch of zones
 * @param zones - Array of zone data objects
 * @returns Array of prediction results
 */
export const getPredictions = async (zones: ZoneData[]): Promise<PredictionResult[]> => {
  // Check if ML API is enabled
  if (!ML_API_ENABLED) {
    console.warn("ML API is disabled. Returning empty predictions.");
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
      throw new Error(`ML API returned ${response.status}: ${response.statusText}`);
    }

    const predictions: PredictionResult[] = await response.json();
    console.log(`ML API returned predictions for ${predictions.length} zones`);

    return predictions;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`ML API timeout after ${ML_API_TIMEOUT}ms`);
    } else {
      console.error("ML API call failed:", error.message);
    }
    
    // Fallback: return zones without predictions
    console.warn("Returning zones without ML predictions");
    return zones.map(z => ({
      zone_id: z.zone_id,
      predicted_calls: 0,
      risk_score: 0,
      risk_class: "LOW" as const,
      reasons: ["ML API unavailable"]
    }));
  }
};

/**
 * Get prediction for a single zone (alternative to batch)
 * @param zone - Single zone data object
 * @returns Single prediction result
 */
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
    console.error(`ML API call failed for zone ${zone.zone_id}:`, error.message);
    
    // Fallback: return zone without prediction
    return {
      zone_id: zone.zone_id,
      predicted_calls: 0,
      risk_score: 0,
      risk_class: "LOW",
      reasons: ["ML API unavailable"]
    };
  }
};

/**
 * Check if ML API is available
 * @returns true if API is accessible and healthy
 */
export const checkMLAPIHealth = async (): Promise<boolean> => {
  if (!ML_API_ENABLED) {
    return false;
  }

  try {
    const response = await fetch(`${ML_API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(ML_API_TIMEOUT)
    });
    return response.ok;
  } catch (error) {
    console.warn("ML API health check failed:", error);
    return false;
  }
};