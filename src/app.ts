import express, { type Express, type Request, type Response } from "express";
import type { PrismaClient } from "./generated/prisma/client";
import type { RedisClientType } from "redis";

import { HealthService } from "./application/services/health.service";
import { HealthController } from "./interfaces/http/controllers/health.controller";
import { createHealthRoutes } from "./interfaces/http/routes/health.route";
import { requestLoggingMiddleware } from "./interfaces/http/middlewares/request-logging.middleware";
import { logger } from "./infrastructure/logging/logger";
import { errorHandlerMiddleware } from "./interfaces/http/middlewares/error-handler.middleware";
import { sendSuccess } from "./shared/http/api-response";
import { AuthController } from "./interfaces/http/controllers/auth.controller";
import { createAuthRoutes } from "./interfaces/http/routes/auth.route";

type AppDependencies = {
  prisma: PrismaClient;
  redis: RedisClientType;
};

export function createApp({ prisma, redis }: AppDependencies): Express {
  const app = express();
  const authController = new AuthController();

  app.use("/auth", createAuthRoutes(authController));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLoggingMiddleware);

  const healthService = new HealthService(prisma, redis);
  const healthController = new HealthController(healthService);

  app.get("/", (_req: Request, res: Response) => {
    return sendSuccess(res, { message: "Outdoor backend is running" });
  });

  app.use("/health", createHealthRoutes(healthController));

  app.use((_req: Request, res: Response) => {
    const requestLogger = res.locals.logger ?? logger;

    requestLogger.warn(
      {
        statusCode: 404,
        path: _req.originalUrl,
        method: _req.method,
      },
      "route not found",
    );

    res.status(404).json({
      error: "Route not found",
    });
  });

  app.use(errorHandlerMiddleware);

  return app;
}
