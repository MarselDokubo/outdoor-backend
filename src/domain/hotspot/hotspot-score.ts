import type { HotspotWindow } from "../../application/discovery/contracts.js";
import type { HotspotQueryRow } from "../../application/discovery/use-cases/query-services.js";

export interface ScoredHotspot {
  score: number;
  reasons: string[];
}

const WINDOW_WEIGHTS: Record<
  HotspotWindow,
  {
    visits: number;
    reactions: number;
    comments: number;
    saves: number;
    impressions: number;
    follows: number;
    activeEvents: number;
    recentPosts: number;
    decayFloor: number;
    decayHours: number;
  }
> = {
  LIVE_3H: {
    visits: 9,
    reactions: 4,
    comments: 5,
    saves: 5,
    impressions: 1,
    follows: 4,
    activeEvents: 6,
    recentPosts: 3,
    decayFloor: 0.3,
    decayHours: 6,
  },
  DAY_1: {
    visits: 8,
    reactions: 3,
    comments: 4,
    saves: 5,
    impressions: 1,
    follows: 5,
    activeEvents: 5,
    recentPosts: 2,
    decayFloor: 0.4,
    decayHours: 24,
  },
};

export function scoreHotspot(row: HotspotQueryRow, window: HotspotWindow): ScoredHotspot {
  const weights = WINDOW_WEIGHTS[window];

  const parts = [
    { label: "visits", value: contribution(row.visitCount, weights.visits) },
    { label: "reactions", value: contribution(row.reactionCount, weights.reactions) },
    { label: "comments", value: contribution(row.commentCount, weights.comments) },
    { label: "saves", value: contribution(row.saveCount, weights.saves) },
    { label: "impressions", value: contribution(row.impressionCount, weights.impressions) },
    { label: "follows", value: contribution(row.followCount, weights.follows) },
    { label: "events", value: contribution(row.activeEventCount, weights.activeEvents) },
    { label: "posts", value: contribution(row.recentPostCount, weights.recentPosts) },
  ];

  const baseScore = parts.reduce((sum, item) => sum + item.value, 0);
  const freshnessMultiplier = freshnessDecay(
    row.lastSignalAt,
    weights.decayHours,
    weights.decayFloor,
  );
  const score = round2(baseScore * freshnessMultiplier);

  const reasons = parts
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 3)
    .map((item) => item.label);

  return {
    score,
    reasons,
  };
}

function contribution(count: number, weight: number): number {
  if (count <= 0) {
    return 0;
  }

  return Math.log1p(count) * weight;
}

function freshnessDecay(lastSignalAt: Date | null, decayHours: number, floor: number): number {
  if (!lastSignalAt) {
    return floor;
  }

  const ageHours = Math.max(0, (Date.now() - lastSignalAt.getTime()) / (1000 * 60 * 60));
  const decay = Math.exp(-ageHours / decayHours);

  return Math.max(floor, decay);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
