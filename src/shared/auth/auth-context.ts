import type { JWTPayload } from "jose";
import type { SystemRole } from "../../domain/user/system-role";

export interface AuthContext {
  provider: "oidc";
  subject: string;
  issuer: string;
  audience: string | string[];
  email?: string;
  emailVerified?: boolean;
  roles: SystemRole[];
  claims: JWTPayload;
}
