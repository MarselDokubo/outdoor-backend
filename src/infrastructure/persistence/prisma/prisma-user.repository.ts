import type { PrismaClient } from "../../../generated/prisma/client";
import type {
  CreateUserInput,
  UpdateUserLoginMetadataInput,
  UserRecord,
  UserRepository,
} from "../../../domain/user/repositories/user.repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<UserRecord> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        displayName: data.displayName ?? null,
        status: data.status ?? "active",
      },
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
      lastSeenAt: user.lastSeenAt,
    };
  }

  async updateLoginMetadata(
    userId: string,
    data: UpdateUserLoginMetadataInput,
  ): Promise<UserRecord> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.displayName !== undefined ? { displayName: data.displayName } : {}),
        lastSeenAt: data.lastSeenAt,
      },
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      status: user.status,
      lastSeenAt: user.lastSeenAt,
    };
  }
}
