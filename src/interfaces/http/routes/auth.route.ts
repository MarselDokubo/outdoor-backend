import { Router } from "express";
import type { CurrentUserResolverService } from "../../../application/services/current-user-resolver.service";
import type { AuthController } from "../controllers/auth.controller";
import { attachAuthContext } from "../middlewares/auth.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { requireRole } from "../middlewares/require-role.middleware";
import { resolveCurrentUser } from "../middlewares/resolve-current-user.middleware";

export function createAuthRoutes(
  controller: AuthController,
  currentUserResolver: CurrentUserResolverService,
): Router {
  const router = Router();
  const resolveUser = resolveCurrentUser(currentUserResolver);

  router.get("/me", attachAuthContext, requireAuth, resolveUser, controller.me);

  router.get(
    "/admin-test",
    attachAuthContext,
    requireAuth,
    resolveUser,
    requireRole("admin"),
    controller.adminTest,
  );

  return router;
}
