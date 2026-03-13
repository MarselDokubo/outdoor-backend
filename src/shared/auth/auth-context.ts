import type { JWTPayload } from "jose";
import type { UserRole } from "../../domain/user/user-role";

export interface AuthContext {
  provider: "oidc";
  subject: string;
  issuer: string;
  audience: string | string[];
  email?: string;
  emailVerified?: boolean;
  roles: UserRole[];
  claims: JWTPayload;
}
