import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value : undefined;
}

function getNumberEnv(name: string, fallback?: number): number {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`${name} is not set`);
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a valid number`);
  }

  return parsed;
}

const NODE_ENV = getOptionalEnv("NODE_ENV") ?? "development";
const EXPOSE_ERROR_DETAILS =
  (getOptionalEnv("EXPOSE_ERROR_DETAILS") ?? (NODE_ENV !== "production" ? "true" : "false")) ===
  "true";

export const env = {
  NODE_ENV,
  IS_DEV: NODE_ENV === "development",
  IS_TEST: NODE_ENV === "test",
  IS_PROD: NODE_ENV === "production",

  EXPOSE_ERROR_DETAILS,

  HOST: getOptionalEnv("HOST") ?? "0.0.0.0",
  PORT: getNumberEnv("PORT", 3000),

  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  REDIS_URL: getRequiredEnv("REDIS_URL"),

  LOG_LEVEL: getOptionalEnv("LOG_LEVEL") ?? (NODE_ENV === "production" ? "info" : "debug"),

  OIDC_ISSUER: getOptionalEnv("OIDC_ISSUER"),
  OIDC_AUDIENCE: getOptionalEnv("OIDC_AUDIENCE"),
} as const;
