import type { Request, Response } from "express";
import { sendSuccess } from "../../../shared/http/api-response";

export class AuthController {
  me = (_req: Request, res: Response): void => {
    sendSuccess(res, {
      user: res.locals.auth,
    });
  };
}
