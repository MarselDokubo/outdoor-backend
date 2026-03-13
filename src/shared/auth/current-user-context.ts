import type { UserRole } from "../../domain/user/user-role";
import type { AuthContext } from "./auth-context";

export interface CurrentUserContext {
  userId: string;
  email?: string;
  displayName?: string;
  role: UserRole;
  isActive: boolean;
  auth: AuthContext;
}
