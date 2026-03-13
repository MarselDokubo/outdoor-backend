import type { Logger } from "pino";
import type { AuthContext } from "../shared/auth/auth-context";

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
    }
  }
}

export {};
