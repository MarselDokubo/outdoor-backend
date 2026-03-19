import type {
  AssignUserRoleInput,
  UserRoleAssignmentRecord,
  UserRoleAssignmentRepository,
} from "../../../domain/user/repositories/user-role-assignment.repository";
import type { PrismaClient } from "../../../generated/prisma/client";

export class PrismaUserRoleAssignmentRepository implements UserRoleAssignmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listByUserId(userId: string): Promise<UserRoleAssignmentRecord[]> {
    return this.prisma.userRoleAssignment.findMany({
      where: { userId },
      orderBy: { assignedAt: "asc" },
    });
  }

  async assign(data: AssignUserRoleInput): Promise<UserRoleAssignmentRecord> {
    return this.prisma.userRoleAssignment.upsert({
      where: {
        userId_role: {
          userId: data.userId,
          role: data.role,
        },
      },
      create: {
        userId: data.userId,
        role: data.role,
        assignedBy: data.assignedBy ?? null,
        reason: data.reason ?? null,
      },
      update: {},
    });
  }

  async remove(userId: string, role: AssignUserRoleInput["role"]): Promise<void> {
    await this.prisma.userRoleAssignment.deleteMany({
      where: { userId, role },
    });
  }
}
