import type { Request, Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { sendError } from "../../../shared/http/send-error.js";
import type { buildEventModule } from "../../../application/event/event.module.js";

export class EventController {
  constructor(private readonly handlers: ReturnType<typeof buildEventModule>) {
    void this.handlers;
  }

  public requireActor(req: Request): string {
    const currentUser = resCurrentUser(req);
    if (!currentUser?.userId) {
      throw new UnauthorizedError("Authentication required");
    }

    return currentUser.userId;
  }

  public getActor(req: Request): string | null {
    const currentUser = resCurrentUser(req);
    return currentUser?.userId ?? null;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}

function resCurrentUser(req: Request) {
  return req.res?.locals.currentUser ?? null;
}
