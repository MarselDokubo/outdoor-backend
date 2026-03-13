import type { Request, Response } from "express";
import { getCurrentUser } from "../../../shared/auth/get-current-user";
import { sendSuccess } from "../../../shared/http/api-response";

export class AuthController {
  me = (_req: Request, res: Response): void => {
    const currentUser = getCurrentUser(res.locals);

    sendSuccess(res, {
      user: {
        id: currentUser.userId,
        email: currentUser.email,
        displayName: currentUser.displayName,
        role: currentUser.role,
        isActive: currentUser.isActive,
        auth: {
          subject: currentUser.auth.subject,
          issuer: currentUser.auth.issuer,
        },
      },
    });
  };

  adminTest = (_req: Request, res: Response): void => {
    const currentUser = getCurrentUser(res.locals);

    sendSuccess(res, {
      message: "Admin authorization check passed",
      user: {
        id: currentUser.userId,
        role: currentUser.role,
      },
    });
  };
}
