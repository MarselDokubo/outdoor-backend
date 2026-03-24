import type { Request, Response } from "express";
import type { buildMediaModule } from "../../../application/media/media.module.js";
import { sendError } from "../../../shared/http/send-error.js";

type MediaHandlers = ReturnType<typeof buildMediaModule>;

export class MediaController {
  constructor(private readonly handlers: MediaHandlers) {}

  public getActor(req: Request) {
    return resLocalsCurrentUser(req);
  }

  public requireActor(req: Request) {
    const actor = resLocalsCurrentUser(req);

    if (!actor) {
      throw new Error("Authenticated actor is required.");
    }

    return actor;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}

function resLocalsCurrentUser(req: Request) {
  return req.res?.locals.currentUser ?? null;
}
