import type { NextFunction, Request, Response } from "express";
import type { SystemRole } from "../../../domain/user/system-role";
import { ForbiddenError } from "../../../shared/errors/app-error";
import { getCurrentUser } from "../../../shared/auth/get-current-user";

export function requireRole(...roles: SystemRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const currentUser = getCurrentUser(res.locals);

    const hasRole = roles.some((role) => currentUser.roles.includes(role));

    if (!hasRole) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
}
