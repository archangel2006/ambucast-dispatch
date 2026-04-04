import type{ Request, Response } from "express";
import { runAllocation } from "./allocation.service.js";

export const allocateAmbulances = async (_req: Request, res: Response) => {
  try {
    const result = await runAllocation();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Allocation failed" });
  }
};