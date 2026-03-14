import { Router } from "express";
import { NotificationsController } from "../controllers/notifications.controller";
import { validate } from "../middlewares/validate.middleware";
import { requireAuth } from "../middlewares/require-auth.middleware";
import { attachAuthContext } from "../middlewares/auth.middleware";

export function createNotificationsRoutes(controller: NotificationsController): Router {
  const router = Router();

  router.post(
    "/enqueue",
    attachAuthContext,
    requireAuth,
    validate({ body: NotificationsController.bodySchema }),
    controller.enqueue,
  );

  return router;
}
