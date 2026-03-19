import type { UserStatus } from "../user-status";

export interface UserRecord {
  id: string;
  email: string | null;
  displayName: string | null;
  status: UserStatus;
  lastSeenAt: Date | null;
}

export interface CreateUserInput {
  email: string | null;
  displayName?: string | null;
  status?: UserStatus;
}

export interface UpdateUserLoginMetadataInput {
  email?: string | null;
  displayName?: string | null;
  lastSeenAt: Date;
}

export interface UserRepository {
  create(data: CreateUserInput): Promise<UserRecord>;
  updateLoginMetadata(userId: string, data: UpdateUserLoginMetadataInput): Promise<UserRecord>;
}
