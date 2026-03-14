import { logger } from "../infrastructure/logging/logger";
import { notificationWorker } from "./jobs/notification-dispatch.worker";

logger.info("workers started");

process.on("SIGINT", async () => {
  await notificationWorker.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await notificationWorker.close();
  process.exit(0);
});
