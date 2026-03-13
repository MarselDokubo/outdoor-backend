import type { NextFunction, Request, Response } from "express";
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

/**
 * Optional auth attachment:
 * - no Authorization header => continue anonymously
 * - invalid bearer token => 401
 * - valid bearer token => res.locals.auth populated
 */
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
  } catch {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
}
