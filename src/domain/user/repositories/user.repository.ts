import type { SystemRole } from "../system-role";

export interface UserRecord {
  id: string;
  email: string | null;
  displayName: string | null;
  role: SystemRole;
  isActive: boolean;
}

export interface CreateUserInput {
  email: string | null;
  role: SystemRole;
}

export interface UserRepository {
  create(data: CreateUserInput): Promise<UserRecord>;
}
