import type{ Request, Response } from "express";
import {
  getAllAmbulances,
  updateAmbulanceLocation,
  updateAmbulanceStatus,
} from "./ambulance.service.js";

export const fetchAmbulances = async (_req: Request, res: Response) => {
  try {
    const data = await getAllAmbulances();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ambulances" });
  }
};

export const moveAmbulance = async (req: Request, res: Response) => {
  try {
    const { id, lat, lng } = req.body;
    const result = await updateAmbulanceLocation(id, lat, lng);
    res.json(result);
  } catch (err: any) {
    if (err.message === "Ambulance not found") {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: "Failed to move ambulance" });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    const result = await updateAmbulanceStatus(id, status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};