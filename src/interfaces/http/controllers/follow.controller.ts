import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { sendError } from "../../../shared/http/send-error.js";
import type { buildFollowModule } from "../../../application/engagement/follow.module.js";

export class FollowController {
  constructor(private readonly handlers: ReturnType<typeof buildFollowModule>) {
    void this.handlers;
  }

  public requireActor(req: Request): string {
    const currentUser = req.res?.locals.currentUser;

    if (!currentUser?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    return currentUser.userId;
  }

  public getActor(req: Request): string | null {
    return req.res?.locals.currentUser?.userId ?? null;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
