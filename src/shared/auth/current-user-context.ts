import type { SystemRole } from "../../domain/user/system-role";
import type { AuthContext } from "./auth-context";

export interface CurrentUserContext {
  userId: string;
  email?: string;
  displayName?: string;
  role: SystemRole;
  isActive: boolean;
  auth: AuthContext;
}
