export interface HotspotInput {
  zone_id: string;
  area?: string;
  lat?: number;
  lng?: number;
  predicted_calls?: number;
  risk_score?: number;
  risk_class?: string;
  reasons?: string[];
  timestamp?: string;
}

export interface PredictionInput {
  timestamp?: string;
  hotspots: HotspotInput[];
}