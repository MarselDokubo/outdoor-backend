import { Router } from "express";
import type { GeoController } from "../controllers/geo.controller";
import {
  validateGeocodeBody,
  validateGeoPointBody,
} from "../middlewares/geo-validation.middleware";

export function createGeoRoutes(controller: GeoController): Router {
  const router = Router();

  router.post("/validate-point", validateGeoPointBody, controller.validatePoint);
  router.post("/geocode", validateGeocodeBody, controller.geocode);
  router.post("/reverse-geocode", validateGeoPointBody, controller.reverseGeocode);

  return router;
}
