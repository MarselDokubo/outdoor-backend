import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../../domain/user/user-role";
import { ForbiddenError, UnauthorizedError } from "../../../shared/errors/app-error";

export function requireRole(...roles: UserRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const auth = res.locals.auth;

    if (!auth) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    const allowed = auth.roles.some((role) => roles.includes(role));

    if (!allowed) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
}
