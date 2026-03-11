import { Router } from "express";
import { HealthController } from "../controllers/health.controller";

export function createHealthRoutes(controller: HealthController): Router {
	const router = Router();

	router.get("/live", controller.live);
	router.get("/ready", controller.ready);
	router.get("/deps", controller.deps);

	return router;
}
