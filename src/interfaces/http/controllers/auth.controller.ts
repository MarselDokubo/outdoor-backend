import type { Request, Response } from "express";
import { getAuthContext } from "../../../shared/auth/get-auth";
import { sendSuccess } from "../../../shared/http/api-response";

export class AuthController {
  me = (_req: Request, res: Response): void => {
    const auth = getAuthContext(res.locals);

    sendSuccess(res, {
      user: {
        subject: auth.subject,
        issuer: auth.issuer,
        audience: auth.audience,
        email: auth.email,
        emailVerified: auth.emailVerified,
        roles: auth.roles,
      },
    });
  };

  adminTest = (_req: Request, res: Response): void => {
    const auth = getAuthContext(res.locals);

    sendSuccess(res, {
      message: "Admin authorization check passed",
      user: {
        subject: auth.subject,
        roles: auth.roles,
      },
    });
  };
}
