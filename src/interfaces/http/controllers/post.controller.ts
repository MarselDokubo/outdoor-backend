import type { Response } from "express";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { sendError } from "../../../shared/http/send-error.js";

export class PostController {
  public getActorUserId(res: Response): string | undefined {
    const currentUser = res.locals.currentUser as Record<string, unknown> | undefined;

    if (!currentUser) {
      return undefined;
    }

    const userId = currentUser.userId;
    if (typeof userId === "string") {
      return userId;
    }

    const id = currentUser.id;
    return typeof id === "string" ? id : undefined;
  }

  public requireActorUserId(res: Response): string {
    const actorUserId = this.getActorUserId(res);

    if (!actorUserId) {
      throw new UnauthorizedError("Authentication required");
    }

    return actorUserId;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
