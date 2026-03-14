import type { NextFunction, Request, Response } from "express";
import type { CurrentUserResolverService } from "../../../application/services/current-user-resolver.service";
import { UnauthorizedError } from "../../../shared/errors/app-error";

export function resolveCurrentUser(resolver: CurrentUserResolverService) {
  return async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!res.locals.auth) {
        next(new UnauthorizedError("Authentication required"));
        return;
      }

      const currentUser = await resolver.resolve(res.locals.auth);
      res.locals.currentUser = currentUser;

      next();
    } catch (error) {
      next(error);
    }
  };
}
