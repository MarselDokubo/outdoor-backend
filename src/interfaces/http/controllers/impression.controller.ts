import type { Request, Response } from "express";
import { sendError } from "../../../shared/http/send-error.js";
import type { buildImpressionModule } from "../../../application/engagement/impression.module.js";

export class ImpressionController {
  constructor(private readonly handlers: ReturnType<typeof buildImpressionModule>) {
    void this.handlers;
  }

  public getActorUserId(req: Request): string | null {
    return req.res?.locals.currentUser?.userId ?? null;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
