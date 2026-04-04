export interface HotspotInput {
  area: string;
  lat: number;
  lng: number;
  risk: "low" | "medium" | "high";
}

export interface PredictionInput {
  timestamp: string;
  hotspots: HotspotInput[];
}