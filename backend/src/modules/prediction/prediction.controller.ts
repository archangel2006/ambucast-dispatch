import { storePrediction } from "./prediction.service.js";
import { prisma } from "../../lib/prisma.js";
import type { Request, Response } from "express";

export const createPrediction = async (req: Request, res: Response) => {
  console.log("🔥 HIT createPrediction"); 
  try {
    const result = await storePrediction(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to store prediction" });
  }
};

export const getHotspots = async (req: Request, res: Response) => {
  try {
    const hotspots = await prisma.hotspot.findMany({
      orderBy: { timestamp: "desc" },
      take: 10
    });

    res.status(200).json(hotspots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hotspots" });
  }
};