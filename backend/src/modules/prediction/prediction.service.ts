import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { HotspotInput, PredictionInput } from "./prediction.types.js";

export const storePrediction = async (data: PredictionInput) => {
  const { hotspots, timestamp } = data;

  // 1. store raw JSON
  await prisma.prediction.create({
    data: {
      data: data as unknown as Prisma.JsonObject
    }
  });

  // 2. store hotspots
  const hotspotEntries = hotspots.map((h: HotspotInput) => ({
    area: h.area,
    lat: h.lat,
    lng: h.lng,
    risk: h.risk,
    timestamp: new Date(timestamp)
  }));

  await prisma.hotspot.createMany({
    data: hotspotEntries
  });

  return { message: "Prediction stored successfully" };
};