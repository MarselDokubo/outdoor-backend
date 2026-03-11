import express, {
	type Express,
	type NextFunction,
	type Request,
	type Response,
} from "express";

import { HealthService } from "./application/services/health.service";
import { prisma } from "./infrastructure/prisma/client";
import { redisClient } from "./infrastructure/redis/client";
import { HealthController } from "./interfaces/http/controllers/health.controller";
import { createHealthRoutes } from "./interfaces/http/routes/health.route";

export function createApp(): Express {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	const healthService = new HealthService(prisma, redisClient);
	const healthController = new HealthController(healthService);

	app.get("/", (_req: Request, res: Response) => {
		res.status(200).json({
			message: "Outdoor backend is running",
		});
	});

	app.use("/health", createHealthRoutes(healthController));

	app.use((_req: Request, res: Response) => {
		res.status(404).json({
			error: "Route not found",
		});
	});

	app.use(
		(
			error: unknown,
			_req: Request,
			res: Response,
			_next: NextFunction,
		): void => {
			console.error("[http] unhandled error:", error);

			res.status(500).json({
				error: "Internal server error",
			});
		},
	);

	return app;
}
