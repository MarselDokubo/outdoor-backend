import type { EngagementTargetType } from "../../domain/engagement/engagement.enums.js";

export interface RecordImpressionCommand {
  targetType: EngagementTargetType;
  targetId: string;
  actorUserId?: string | null;
  sessionKey?: string | null;
}

export interface GetImpressionSummaryQuery {
  targetType: EngagementTargetType;
  targetId: string;
  actorUserId?: string | null;
  sessionKey?: string | null;
}

export interface ImpressionView {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  viewerUserId: string | null;
  sessionKey: string | null;
  createdAt: string;
}

export interface ImpressionSummaryView {
  targetType: EngagementTargetType;
  targetId: string;
  totalImpressions: number;
  impressionsLast24Hours: number;
  viewerHasViewed: boolean;
}
