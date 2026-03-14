import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { RedisClientType } from "redis";
import type { PrismaClient } from "./generated/prisma/client";

import { CurrentUserResolverService } from "./application/services/current-user-resolver.service";
import { HealthService } from "./application/services/health.service";
import { logger } from "./infrastructure/logging/logger";
import { PrismaAuthIdentityRepository } from "./infrastructure/persistence/prisma/prisma-auth-identity.repository";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma/prisma-user.repository";
import { AuthController } from "./interfaces/http/controllers/auth.controller";
import { HealthController } from "./interfaces/http/controllers/health.controller";
import { errorHandlerMiddleware } from "./interfaces/http/middlewares/error-handler.middleware";
import { requestLoggingMiddleware } from "./interfaces/http/middlewares/request-logging.middleware";
import { createAuthRoutes } from "./interfaces/http/routes/auth.route";
import { createHealthRoutes } from "./interfaces/http/routes/health.route";
import { NotFoundError } from "./shared/errors/app-error";
import { sendSuccess } from "./shared/http/api-response";

interface AppDependencies {
  prisma: PrismaClient;
  redis: RedisClientType;
}

export function createApp({ prisma, redis }: AppDependencies): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLoggingMiddleware);

  const healthService = new HealthService(prisma, redis);
  const healthController = new HealthController(healthService);

  const userRepository = new PrismaUserRepository(prisma);
  const authIdentityRepository = new PrismaAuthIdentityRepository(prisma);
  const currentUserResolver = new CurrentUserResolverService(
    userRepository,
    authIdentityRepository,
  );
  const authController = new AuthController();

  app.get("/", (_req: Request, res: Response) => {
    return sendSuccess(res, {
      message: "Outdoor backend is running",
    });
  });

  app.use("/health", createHealthRoutes(healthController));
  app.use("/auth", createAuthRoutes(authController, currentUserResolver));

  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestLogger = res.locals.logger ?? logger;

    requestLogger.warn(
      {
        path: req.originalUrl,
        method: req.method,
      },
      "route not found",
    );

    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
  });

  app.use(errorHandlerMiddleware);

  return app;
}
