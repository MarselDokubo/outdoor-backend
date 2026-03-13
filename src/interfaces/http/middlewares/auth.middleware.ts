import type { NextFunction, Request, Response } from "express";
import { logger } from "../../../infrastructure/logging/logger";
import { UnauthorizedError } from "../../../shared/errors/app-error";
import { verifyAccessToken } from "../../../shared/auth/oidc";

function getBearerToken(req: Request): string | null {
  const authorization = req.header("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (!scheme || !token) {
    return null;
  }

  if (scheme.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}

export async function attachAuthContext(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = getBearerToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const auth = await verifyAccessToken(token);
    res.locals.auth = auth;
    next();
  } catch (error) {
    const requestLogger = res.locals.logger ?? logger;

    requestLogger.error(
      {
        err: error,
        issuer: process.env.OIDC_ISSUER,
        audience: process.env.OIDC_AUDIENCE,
      },
      "oidc access token verification failed",
    );

    next(new UnauthorizedError("Invalid or expired access token"));
  }
}
