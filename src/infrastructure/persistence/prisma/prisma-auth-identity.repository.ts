import type { PrismaClient } from "../../../generated/prisma/client";
import type {
  AuthIdentityRecord,
  AuthIdentityRepository,
  CreateAuthIdentityInput,
  FindAuthIdentityInput,
  UpdateAuthIdentityLoginInput,
} from "../../../domain/user/repositories/auth-identity.repository";

export class PrismaAuthIdentityRepository implements AuthIdentityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByProviderSubject(data: FindAuthIdentityInput): Promise<AuthIdentityRecord | null> {
    const identity = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerSubject: {
          provider: data.provider,
          providerSubject: data.providerSubject,
        },
      },
      include: {
        user: true,
      },
    });

    if (!identity) {
      return null;
    }

    return {
      id: identity.id,
      userId: identity.userId,
      provider: identity.provider,
      providerSubject: identity.providerSubject,
      providerEmail: identity.providerEmail,
      emailVerified: identity.emailVerified,
      lastLoginAt: identity.lastLoginAt,
      user: {
        id: identity.user.id,
        email: identity.user.email,
        displayName: identity.user.displayName,
        role: identity.user.role,
        isActive: identity.user.isActive,
      },
    };
  }

  async create(data: CreateAuthIdentityInput): Promise<AuthIdentityRecord> {
    const identity = await this.prisma.authIdentity.create({
      data: {
        userId: data.userId,
        provider: data.provider,
        providerSubject: data.providerSubject,
        providerEmail: data.providerEmail,
        emailVerified: data.emailVerified,
        lastLoginAt: data.lastLoginAt,
      },
      include: {
        user: true,
      },
    });

    return {
      id: identity.id,
      userId: identity.userId,
      provider: identity.provider,
      providerSubject: identity.providerSubject,
      providerEmail: identity.providerEmail,
      emailVerified: identity.emailVerified,
      lastLoginAt: identity.lastLoginAt,
      user: {
        id: identity.user.id,
        email: identity.user.email,
        displayName: identity.user.displayName,
        role: identity.user.role,
        isActive: identity.user.isActive,
      },
    };
  }

  async updateLogin(id: string, data: UpdateAuthIdentityLoginInput): Promise<AuthIdentityRecord> {
    const identity = await this.prisma.authIdentity.update({
      where: { id },
      data: {
        providerEmail: data.providerEmail,
        emailVerified: data.emailVerified,
        lastLoginAt: data.lastLoginAt,
      },
      include: {
        user: true,
      },
    });

    return {
      id: identity.id,
      userId: identity.userId,
      provider: identity.provider,
      providerSubject: identity.providerSubject,
      providerEmail: identity.providerEmail,
      emailVerified: identity.emailVerified,
      lastLoginAt: identity.lastLoginAt,
      user: {
        id: identity.user.id,
        email: identity.user.email,
        displayName: identity.user.displayName,
        role: identity.user.role,
        isActive: identity.user.isActive,
      },
    };
  }
}
