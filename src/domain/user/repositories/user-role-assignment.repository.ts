import type { SystemRole } from "../system-role";

export interface UserRoleAssignmentRecord {
  id: string;
  userId: string;
  role: SystemRole;
  assignedBy: string | null;
  assignedAt: Date;
  reason: string | null;
}

export interface AssignUserRoleInput {
  userId: string;
  role: SystemRole;
  assignedBy?: string | null;
  reason?: string | null;
}

export interface UserRoleAssignmentRepository {
  listByUserId(userId: string): Promise<UserRoleAssignmentRecord[]>;
  assign(data: AssignUserRoleInput): Promise<UserRoleAssignmentRecord>;
  remove(userId: string, role: SystemRole): Promise<void>;
}
