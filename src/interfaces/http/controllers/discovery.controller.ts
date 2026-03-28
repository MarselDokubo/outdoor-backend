import type { Request, Response } from "express";
import { sendError } from "../../../shared/http/send-error.js";

export class DiscoveryController {
  public optionalActor(req: Request): string | null {
    return req.res?.locals.currentUser?.userId ?? null;
  }

  public sendError(res: Response, error: unknown): void {
    sendError(res, error);
  }
}
