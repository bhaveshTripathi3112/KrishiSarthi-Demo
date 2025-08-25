import express from "express";
import { getLocations, addLocation, saveLocation, getStats, clearLocations } from "../controllers/location.controllers.js";

const locationRouter = express.Router();

locationRouter.post("/", saveLocation);
locationRouter.get("/", getLocations);
locationRouter.post("/", addLocation);
locationRouter.get("/stats", getStats);
locationRouter.delete("/clear", clearLocations);
export default locationRouter;
