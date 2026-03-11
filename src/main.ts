import "dotenv/config";
import http from "node:http";
import { createApp } from "./app";
import { connectPrisma, disconnectPrisma } from "./infrastructure/prisma/client";
import { connectRedis, disconnectRedis } from "./infrastructure/redis/client";

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? "0.0.0.0";

let server: http.Server | null = null;

async function start(): Promise<void> {
	try {
		await connectPrisma();
		console.log("[bootstrap] prisma connected");

		await connectRedis();
		console.log("[bootstrap] redis connected");

		const app = createApp();

		server = app.listen(PORT, HOST, () => {
			console.log(`[bootstrap] Outdoor backend listening on http://${HOST}:${PORT}`);
		});
	} catch (error) {
		console.error("[bootstrap] failed to start application:", error);
		process.exit(1);
	}
}

async function shutdown(signal: string): Promise<void> {
	console.log(`[shutdown] received ${signal}, shutting down gracefully...`);

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

			console.log("[shutdown] http server closed");
		}

		await disconnectRedis();
		console.log("[shutdown] redis disconnected");

		await disconnectPrisma();
		console.log("[shutdown] prisma disconnected");

		process.exit(0);
	} catch (error) {
		console.error("[shutdown] graceful shutdown failed:", error);
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
	console.error("[process] unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
	console.error("[process] uncaught exception:", error);
});

void start();
