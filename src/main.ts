import { env } from "./config/env";
import type http from "node:http";
import { createApp } from "./app";
import { prisma, connectPrisma, disconnectPrisma } from "./infrastructure/prisma/client";
import { redisClient, connectRedis, disconnectRedis } from "./infrastructure/redis/client";
import { logger } from "./infrastructure/logging/logger";

const PORT = Number(env.PORT ?? 3000);
const HOST = env.HOST ?? "0.0.0.0";

let server: http.Server | null = null;
let isShuttingDown = false;

async function start(): Promise<void> {
  try {
    await connectPrisma();
    await connectRedis();

    const app = createApp({
      prisma,
      redis: redisClient,
    });

    server = app.listen(PORT, HOST, () => {
      logger.info({ host: HOST, port: PORT }, "Outdoor backend listening");
    });
  } catch (error) {
    logger.fatal({ err: error }, "failed to start application");
    process.exit(1);
  }
}

async function closeServer(): Promise<void> {
  if (!server) {
    logger.debug("http server was never started");
    return;
  }

  if (!server.listening) {
    logger.debug("http server already stopped");
    return;
  }

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

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    logger.warn({ signal }, "shutdown already in progress");
    return;
  }

  isShuttingDown = true;
  logger.info({ signal }, "shutdown signal received");

  try {
    await closeServer();
    await disconnectRedis();
    await disconnectPrisma();

    process.exit(0);
  } catch (error: unknown) {
    const isServerNotRunning =
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ERR_SERVER_NOT_RUNNING";

    if (isServerNotRunning) {
      logger.warn("http server was already stopped during shutdown");

      await disconnectRedis().catch((error) => {
        logger.warn({ err: error }, "redis disconnect during fallback shutdown failed");
      });

      await disconnectPrisma().catch((error) => {
        logger.warn({ err: error }, "prisma disconnect during fallback shutdown failed");
      });

      process.exit(0);
    }

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
