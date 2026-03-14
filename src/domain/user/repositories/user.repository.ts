import type { UserRole } from "../user-role";

export interface UserRecord {
  id: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  isActive: boolean;
}

export interface CreateUserInput {
  email: string | null;
  role: UserRole;
}

export interface UserRepository {
  create(data: CreateUserInput): Promise<UserRecord>;
}
