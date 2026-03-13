import type { Logger } from "pino";
import type { AuthContext } from "../shared/auth/auth-context";
import type { CurrentUserContext } from "../shared/auth/current-user-context";

interface ValidatedRequestData {
  body?: unknown;
  params?: unknown;
  query?: unknown;
}

declare global {
  namespace Express {
    interface Locals {
      requestId?: string;
      logger?: Logger;
      validated?: ValidatedRequestData;
      auth?: AuthContext;
      currentUser?: CurrentUserContext;
    }
  }
}

export {};
