import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { HotspotInput, PredictionInput } from "./prediction.types.js";
import { getIO } from "../../sockets/socket.js";

export const storePrediction = async (data: PredictionInput) => {
  const { hotspots, timestamp } = data;
  const io = getIO();

  // 1. store raw JSON
  await prisma.prediction.create({
    data: {
      data: data as unknown as Prisma.JsonObject
    }
  });

  // 2. store hotspots (need to check the properties with the ml and frontend)
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

  io.emit("predictions:new", {
  hotspots: hotspotEntries,
  timestamp,
  });

  return { message: "Prediction stored successfully" };
};