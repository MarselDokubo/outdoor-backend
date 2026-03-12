import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import type { PrismaClient } from "./generated/prisma/client";
import type { RedisClientType } from "redis";

import { HealthService } from "./application/services/health.service";
import { HealthController } from "./interfaces/http/controllers/health.controller";
import { createHealthRoutes } from "./interfaces/http/routes/health.route";

type AppDependencies = {
	prisma: PrismaClient;
	redis: RedisClientType;
};

export function createApp({ prisma, redis }: AppDependencies): Express {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(requestLoggingMiddleware);

	const healthService = new HealthService(prisma, redis);
	const healthController = new HealthController(healthService);

	app.get("/", (_req: Request, res: Response) => {
		res.status(200).json({
			message: "Outdoor backend is running",
		});
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

	app.use(
		(
			error: unknown,
			req: Request,
			res: Response,
			_next: NextFunction,
		): void => {
			const requestLogger = res.locals.logger ?? logger;

			requestLogger.error(
				{
					err: error,
					path: req.originalUrl,
					method: req.method,
				},
				"unhandled request error",
			);

			res.status(500).json({
				error: "Internal server error",
			});
		},
	);

	return app;
}
