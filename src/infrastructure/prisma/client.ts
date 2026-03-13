import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { logger } from "../logging/logger";

const prismaLogger = logger.child({ component: "prisma" });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectPrisma(): Promise<void> {
  try {
    prismaLogger.debug("opening prisma connection");
    await prisma.$connect();
    prismaLogger.info("prisma connected");
  } catch (error) {
    prismaLogger.fatal({ err: error }, "failed to connect prisma");
    throw error;
  }
}

export async function disconnectPrisma(): Promise<void> {
  try {
    prismaLogger.debug("closing prisma connection");
    await prisma.$disconnect();
    prismaLogger.info("prisma disconnected");
  } catch (error) {
    prismaLogger.error({ err: error }, "failed to disconnect prisma");
    throw error;
  }
}
