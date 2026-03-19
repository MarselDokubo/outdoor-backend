import type { NextFunction, Request, Response } from "express";
import type { SystemRole } from "../../../domain/user/system-role";
import { ForbiddenError, UnauthorizedError } from "../../../shared/errors/app-error";

export function requireRole(...roles: SystemRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const currentUser = res.locals.currentUser;

    if (!currentUser) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    if (!currentUser.isActive) {
      next(new ForbiddenError("User account is inactive"));
      return;
    }

    const allowed = roles.includes(currentUser.role);

    if (!allowed) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
}
