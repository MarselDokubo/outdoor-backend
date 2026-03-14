import type { PrismaClient } from "../../../generated/prisma/client";
import type {
  CreateUserInput,
  UserRecord,
  UserRepository,
} from "../../../domain/user/repositories/user.repository";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<UserRecord> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        role: data.role,
      },
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isActive: user.isActive,
    };
  }
}
