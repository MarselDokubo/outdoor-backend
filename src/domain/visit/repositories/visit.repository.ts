import type { Visit } from "../visit.js";

export interface VisitRepository {
  findById(visitId: string): Promise<Visit | null>;
  findActiveByUserId(userId: string): Promise<Visit | null>;
  save(visit: Visit): Promise<void>;
}
