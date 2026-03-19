import type { JWTPayload } from "jose";

export interface AuthContext {
  provider: "oidc";
  subject: string;
  issuer: string;
  audience: string | string[];
  email?: string;
  emailVerified?: boolean;
  externalRoles?: string[];
  claims: JWTPayload;
}
