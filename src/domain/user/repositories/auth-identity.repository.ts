import type { UserRecord } from "./user.repository";

export interface AuthIdentityRecord {
  id: string;
  userId: string;
  provider: string;
  providerSubject: string;
  providerEmail: string | null;
  emailVerified: boolean | null;
  lastLoginAt: Date | null;
  user: UserRecord;
}

export interface FindAuthIdentityInput {
  provider: string;
  providerSubject: string;
}

export interface CreateAuthIdentityInput {
  userId: string;
  provider: string;
  providerSubject: string;
  providerEmail: string | null;
  emailVerified: boolean | null;
  lastLoginAt: Date;
}

export interface UpdateAuthIdentityLoginInput {
  providerEmail: string | null;
  emailVerified: boolean | null;
  lastLoginAt: Date;
}

export interface AuthIdentityRepository {
  findByProviderSubject(data: FindAuthIdentityInput): Promise<AuthIdentityRecord | null>;

  create(data: CreateAuthIdentityInput): Promise<AuthIdentityRecord>;

  updateLogin(id: string, data: UpdateAuthIdentityLoginInput): Promise<AuthIdentityRecord>;
}
