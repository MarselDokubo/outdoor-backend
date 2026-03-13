import type { NextFunction, Request, Response } from "express";
import type { PrismaClient } from "../../../generated/prisma/client";
import { UnauthorizedError } from "../../../shared/errors/app-error";
import { CurrentUserResolverService } from "../../../application/services/current-user-resolver.service";

export function resolveCurrentUser(prisma: PrismaClient) {
  const resolver = new CurrentUserResolverService(prisma);

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
