import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller";
import { authenticateRequest } from "../middlewares/auth.middleware";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.get("/me", authenticateRequest, controller.me);

  return router;
}
