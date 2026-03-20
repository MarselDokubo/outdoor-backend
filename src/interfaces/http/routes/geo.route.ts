import { Router } from "express";
import type { GeoController } from "../controllers/geo.controller";

export function createGeoRoutes(controller: GeoController): Router {
  const router = Router();

  router.post("/validate-point", controller.validatePoint);
  router.post("/geocode", controller.geocode);
  router.post("/reverse-geocode", controller.reverseGeocode);

  return router;
}
