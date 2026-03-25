import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { sendError } from "../../../shared/http/send-error.js";
import type { buildEngagementModule } from "../../../application/engagement/engagement.module.js";

export class EngagementController {
  constructor(private readonly handlers: ReturnType<typeof buildEngagementModule>) {
    void this.handlers;
  }

  public requireActor(req: Request): string {
    const currentUser = req.res?.locals.currentUser ?? null;

    if (!currentUser?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    return currentUser.userId;
  }

  public getActor(req: Request): string | null {
    const currentUser = req.res?.locals.currentUser ?? null;
    return currentUser?.userId ?? null;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
