import type { SystemRole } from "../../domain/user/system-role";
import type { UserStatus } from "../../domain/user/user-status";
import type { AuthContext } from "./auth-context";

export interface CurrentUserContext {
  userId: string;
  email?: string;
  displayName?: string;
  roles: SystemRole[];
  status: UserStatus;
  auth: AuthContext;
}
