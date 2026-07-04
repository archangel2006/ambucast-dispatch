import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { HotspotInput, PredictionInput } from "./prediction.types.js";
import { getIO } from "../../sockets/socket.js";
import zones from "../../data/zones.json" with { type: "json" };

const normalizeRisk = (value: string | undefined) => {
  const normalized = String(value || "low").trim().toLowerCase();
  if (normalized === 'moderate') return 'medium';
  return ["critical", "high", "medium", "low"].includes(normalized)
    ? normalized
    : "low";
};

export const storePrediction = async (data: PredictionInput) => {
  const { hotspots, timestamp = new Date().toISOString() } = data;
  const io = getIO();

  // 1. store raw JSON
  await prisma.prediction.create({
    data: {
      data: data as unknown as Prisma.JsonObject,
    },
  });

  // 2. store hotspots using zone metadata when available
  const hotspotEntries = hotspots.map((h: HotspotInput) => {
    const zone = (zones as Record<string, any>)[h.zone_id] as any;
    return {
      zone_id: h.zone_id,
      area: h.area ?? zone?.name ?? h.zone_id,
      lat: h.lat ?? zone?.lat ?? 0,
      lng: h.lng ?? zone?.lng ?? 0,
      predicted_calls: h.predicted_calls ?? 0,
      risk_score: h.risk_score ?? 0,
      risk_class: normalizeRisk(h.risk_class),
      timestamp: h.timestamp ? new Date(h.timestamp) : new Date(timestamp),
    };
  });

  const zoneIds = hotspotEntries.map((entry) => entry.zone_id);
  await prisma.hotspot.deleteMany({
    where: {
      zone_id: { in: zoneIds },
    },
  });

  await prisma.hotspot.createMany({
    data: hotspotEntries,
  });

  io.emit("predictions:new", {
    hotspots: hotspotEntries,
    timestamp,
  });

  return { message: "Prediction stored successfully" };
};