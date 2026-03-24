import type { Actor } from "../../domain/visit/visit-actor.js";
import type { VisitSourceType, VisitStatus } from "../../domain/visit/visit.enums.js";

export interface StartVisitCommand {
  actor: Actor;
  placeId: string;
  sourceType?: VisitSourceType | undefined;
}

export interface EndVisitCommand {
  actor: Actor;
  visitId: string;
}

export interface VisitMutationResult {
  visitId: string;
  placeId: string;
  status: VisitStatus;
  startedAt: string;
  endedAt: string | null;
}

export interface ActiveVisitView {
  visitId: string;
  placeId: string;
  status: VisitStatus;
  sourceType: VisitSourceType;
  startedAt: string;
  endedAt: string | null;
  confidenceScore: number | null;
}

export interface PlaceVisitSummaryView {
  placeId: string;
  activeVisits: number;
  totalVisits: number;
  visitsLast24Hours: number;
  lastVisitStartedAt: string | null;
}
