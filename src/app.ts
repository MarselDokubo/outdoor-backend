import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { RedisClientType } from "redis";
import type { PrismaClient } from "./generated/prisma/client";

import { CurrentUserResolverService } from "./application/services/current-user-resolver.service";
import { HealthService } from "./application/services/health.service";
import { NotificationQueueService } from "./application/services/notification-queue.service";

import { ValidatePointUseCase } from "./application/geo/use-cases/validate-point.use-case";
import { ReverseGeocodePointUseCase } from "./application/geo/use-cases/reverse-geocode-point.use-case";
import { GeocodeAddressUseCase } from "./application/geo/use-cases/geocode-address.use-case";

import { logger } from "./infrastructure/logging/logger";
import { PrismaAuthIdentityRepository } from "./infrastructure/persistence/prisma/prisma-auth-identity.repository";
import { PrismaUserRepository } from "./infrastructure/persistence/prisma/prisma-user.repository";
import { PrismaUserRoleAssignmentRepository } from "./infrastructure/persistence/prisma/prisma-user-role-assignment.repository";
import { notificationQueue } from "./infrastructure/queues/queues";
import { StaticGeocodingProvider } from "./infrastructure/geo/providers/static-geocoding.provider";

import { AuthController } from "./interfaces/http/controllers/auth.controller";
import { HealthController } from "./interfaces/http/controllers/health.controller";
import { NotificationsController } from "./interfaces/http/controllers/notifications.controller";
import { GeoController } from "./interfaces/http/controllers/geo.controller";

import { attachAuthContext } from "./interfaces/http/middlewares/auth.middleware";
import { errorHandlerMiddleware } from "./interfaces/http/middlewares/error-handler.middleware";
import { requestLoggingMiddleware } from "./interfaces/http/middlewares/request-logging.middleware";
import { requireAuth } from "./interfaces/http/middlewares/require-auth.middleware";
import {
  resolveCurrentUser,
  resolveOptionalCurrentUser,
} from "./interfaces/http/middlewares/resolve-current-user.middleware";

import { createAuthRoutes } from "./interfaces/http/routes/auth.route";
import { createHealthRoutes } from "./interfaces/http/routes/health.route";
import { createNotificationsRoutes } from "./interfaces/http/routes/notifications.route";
import { createGeoRoutes } from "./interfaces/http/routes/geo.route";
import { createPlaceRoute } from "./interfaces/http/routes/place.route";
import { createMediaRoute } from "./interfaces/http/routes/media.route";
import { createVisitRoute } from "./interfaces/http/routes/visit.route";
import { createPostRoute } from "./interfaces/http/routes/post.route";

import { NotFoundError } from "./shared/errors/app-error";
import { sendSuccess } from "./shared/http/api-response";
import { LocalObjectStorageService } from "./infrastructure/storage/local-object-storage.service";
import { createEventRoute } from "./interfaces/http/routes/event.route";
import { createEngagementRoute } from "./interfaces/http/routes/engagement.route";
import { createCommentRoute } from "./interfaces/http/routes/comment.route";

interface AppDependencies {
  prisma: PrismaClient;
  redis: RedisClientType;
}

export function createApp({ prisma, redis }: AppDependencies): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLoggingMiddleware);

  // Core services/controllers
  const healthService = new HealthService(prisma, redis);
  const healthController = new HealthController(healthService);

  // Identity and access
  const userRepository = new PrismaUserRepository(prisma);
  const authIdentityRepository = new PrismaAuthIdentityRepository(prisma);
  const userRoleAssignmentRepository = new PrismaUserRoleAssignmentRepository(prisma);

  const currentUserResolver = new CurrentUserResolverService(
    userRepository,
    authIdentityRepository,
    userRoleAssignmentRepository,
  );

  const optionalAuth = resolveOptionalCurrentUser(currentUserResolver);
  const requireAuthForPlaces = requireAuth;
  const resolveRequiredCurrentUser = resolveCurrentUser(currentUserResolver);
  const objectStorage = new LocalObjectStorageService();
  const authController = new AuthController();

  // Geo foundation
  const geocodingProvider = new StaticGeocodingProvider();

  const validatePointUseCase = new ValidatePointUseCase();
  const reverseGeocodePointUseCase = new ReverseGeocodePointUseCase(geocodingProvider);
  const geocodeAddressUseCase = new GeocodeAddressUseCase(geocodingProvider);
  const geoController = new GeoController(
    validatePointUseCase,
    geocodeAddressUseCase,
    reverseGeocodePointUseCase,
  );

  // Notifications
  const notificationQueueService = new NotificationQueueService(notificationQueue);
  const notificationsController = new NotificationsController(notificationQueueService);

  app.get("/", (_req: Request, res: Response) => {
    return sendSuccess(res, {
      message: "Outdoor backend is running",
    });
  });

  app.use("/health", createHealthRoutes(healthController));
  app.use("/auth", createAuthRoutes(authController, currentUserResolver));
  app.use("/geo", createGeoRoutes(geoController));
  app.use("/notifications", createNotificationsRoutes(notificationsController));

  app.use(
    createPlaceRoute({
      prisma,
      attachAuthContext,
      requireAuth: requireAuthForPlaces,
      resolveCurrentUser: resolveRequiredCurrentUser,
      optionalAuth,
    }),
  );
  app.use(
    createMediaRoute({
      prisma,
      storage: objectStorage,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveRequiredCurrentUser,
      optionalAuth,
    }),
  );
  app.use(
    createVisitRoute({
      prisma,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveRequiredCurrentUser,
    }),
  );
  app.use(
    createPostRoute({
      prisma,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveCurrentUser(currentUserResolver),
      optionalAuth: resolveOptionalCurrentUser(currentUserResolver),
    }),
  );
  app.use(
    createEventRoute({
      prisma,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveCurrentUser(currentUserResolver),
      optionalAuth: resolveOptionalCurrentUser(currentUserResolver),
    }),
  );
  app.use(
    createEngagementRoute({
      prisma,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveCurrentUser(currentUserResolver),
      optionalAuth: resolveOptionalCurrentUser(currentUserResolver),
    }),
  );
  app.use(
    createCommentRoute({
      prisma,
      attachAuthContext,
      requireAuth,
      resolveCurrentUser: resolveCurrentUser(currentUserResolver),
      optionalAuth: resolveOptionalCurrentUser(currentUserResolver),
    }),
  );
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
