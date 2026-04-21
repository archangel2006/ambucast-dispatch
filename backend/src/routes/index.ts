import { Router } from "express";
import { createPrediction, getHotspots } from "../modules/prediction/prediction.controller.js";
import { changeStatus, fetchAmbulances, moveAmbulance } from "../modules/ambulance/ambulance.controller.js";
import { seedAmbulances } from "../modules/ambulance/seed/ambulance.seed.js";
import { allocateAmbulances } from "../modules/allocation/allocation.controller.js";
import serviceRoute from "./service.route.js"
import { buildZonePayloads } from "../services/pipeline.js";




const router = Router();

router.post("/predictions", createPrediction);
router.get("/hotspots", getHotspots);
router.get("/ambulances", fetchAmbulances);
router.post("/ambulances/move", moveAmbulance);
router.post("/ambulances/status", changeStatus);
router.get("/ambulances/seed", seedAmbulances);
router.post("/allocation/run", allocateAmbulances);
router.use("/", serviceRoute);


export default router;