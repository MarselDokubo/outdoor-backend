import { env } from "../../config/env";
import pino from "pino";

const isDevelopment = env.NODE_ENV !== "production";

export const logger = pino(
  isDevelopment
    ? {
        level: env.LOG_LEVEL ?? "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {
        level: env.LOG_LEVEL ?? "info",
      },
);
