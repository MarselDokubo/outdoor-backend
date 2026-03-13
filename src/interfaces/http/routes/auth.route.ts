import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller";
import { attachAuthContext } from "../middlewares/auth.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { requireRole } from "../middlewares/require-role.middleware";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.get("/me", attachAuthContext, requireAuth, controller.me);

  router.get(
    "/admin-test",
    attachAuthContext,
    requireAuth,
    requireRole("admin"),
    controller.adminTest,
  );

  return router;
}
