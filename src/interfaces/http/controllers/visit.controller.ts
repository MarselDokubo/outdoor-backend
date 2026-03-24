import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { sendError } from "../../../shared/http/send-error.js";
import type { Actor } from "../../../domain/visit/visit-actor.js";

interface CurrentUserLike {
  userId?: string;
  id?: string;
  roles?: (string | { roleKey?: string; key?: string; code?: string; name?: string })[];
}

export class VisitController {
  public getActor(req: Request): Actor | null {
    const currentUser = (req.res?.locals.currentUser ?? null) as CurrentUserLike | null;
    if (!currentUser) {
      return null;
    }

    const userId = (currentUser.userId ?? currentUser.id ?? "").trim();
    if (!userId) {
      return null;
    }

    const roles = (currentUser.roles ?? [])
      .map((role) => {
        if (typeof role === "string") {
          return role;
        }

        return role.roleKey ?? role.key ?? role.code ?? role.name ?? "";
      })
      .filter((role): role is string => Boolean(role));

    return { userId, roles };
  }

  public requireActor(req: Request): Actor {
    const actor = this.getActor(req);
    if (!actor) {
      throw new UnauthorizedError("Authentication required");
    }

    return actor;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
