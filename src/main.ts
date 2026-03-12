import "dotenv/config";
import http from "node:http";
import { createApp } from "./app";
import {
	prisma,
	connectPrisma,
	disconnectPrisma,
} from "./infrastructure/prisma/client";
import {
	redisClient,
	connectRedis,
	disconnectRedis,
} from "./infrastructure/redis/client";
import { logger } from "./infrastructure/logging/logger";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

let server: http.Server | null = null;

async function start(): Promise<void> {
	try {
		await connectPrisma();
		await connectRedis();

		const app = createApp({
			prisma,
			redis: redisClient,
		});

		server = app.listen(PORT, HOST, () => {
			logger.info(
				{ host: HOST, port: PORT },
				"Outdoor backend listening",
			);
		});
	} catch (error) {
		logger.fatal({ err: error }, "failed to start application");
		process.exit(1);
	}
}

async function shutdown(signal: string): Promise<void> {
	logger.info({ signal }, "shutdown signal received");

	try {
		if (server) {
			await new Promise<void>((resolve, reject) => {
				server?.close((error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				});
			});

			logger.info("http server closed");
		}

		await disconnectRedis();

		await disconnectPrisma();

		process.exit(0);
	} catch (error) {
		logger.fatal({ err: error }, "graceful shutdown failed");
		process.exit(1);
	}
}

process.on("SIGINT", () => {
	void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
	void shutdown("SIGTERM");
});

process.on("unhandledRejection", (reason) => {
	logger.error({ err: reason }, "unhandled rejection");
});

process.on("uncaughtException", (error) => {
	logger.fatal({ err: error }, "uncaught exception");
});
void start();
