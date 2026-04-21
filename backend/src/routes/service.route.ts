import express from "express";
import { buildZonePayloads } from "../services/pipeline.js";

const router = express.Router();

router.get("/pipeline", async (req, res) => {
  try {
    const data = await buildZonePayloads();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Pipeline failed" });
  }
});

export default router;