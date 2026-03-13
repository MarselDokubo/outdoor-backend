import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error";

export function requireAuth(_req: Request, res: Response, next: NextFunction): void {
  if (!res.locals.auth) {
    next(new UnauthorizedError("Authentication required"));
    return;
  }

  next();
}
