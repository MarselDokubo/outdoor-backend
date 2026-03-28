import type { H3GridPort } from "../../../infrastructure/h3/h3-grid.service.js";
import { scoreHotspot } from "../../../domain/hotspot/hotspot-score.js";
import type { HotspotQueryService, HotspotQueryRow } from "./query-services.js";
import type {
  HotPlaceView,
  HotspotWindow,
  PlaceHotspotQuery,
  PlaceHotspotView,
} from "../contracts.js";

export class GetPlaceHotspotUseCase {
  constructor(
    private readonly queryService: HotspotQueryService,
    private readonly h3Grid: H3GridPort,
  ) {}

  public async execute(query: PlaceHotspotQuery): Promise<PlaceHotspotView> {
    const window = normalizeWindow(query.window);
    const generatedAt = new Date();
    const row = await this.queryService.findPlaceSignals({
      placeId: query.placeId,
      window,
    });

    if (!row) {
      return {
        window,
        generatedAt: generatedAt.toISOString(),
        item: null,
      };
    }

    return {
      window,
      generatedAt: generatedAt.toISOString(),
      item: toView(row, this.h3Grid, window, generatedAt),
    };
  }
}

function toView(
  row: HotspotQueryRow,
  h3Grid: H3GridPort,
  window: HotspotWindow,
  generatedAt: Date,
): HotPlaceView {
  const scored = scoreHotspot(row, window);

  return {
    placeId: row.placeId,
    slug: row.slug,
    name: row.name,
    categoryCode: row.categoryCode,
    latitude: row.latitude,
    longitude: row.longitude,
    distanceMeters: row.distanceMeters,
    h3Cell: h3Grid.cellFor(row.latitude, row.longitude),
    score: scored.score,
    generatedAt: generatedAt.toISOString(),
    lastSignalAt: row.lastSignalAt ? row.lastSignalAt.toISOString() : null,
    reasons: scored.reasons,
    signals: {
      visits: row.visitCount,
      reactions: row.reactionCount,
      comments: row.commentCount,
      saves: row.saveCount,
      impressions: row.impressionCount,
      follows: row.followCount,
      activeEvents: row.activeEventCount,
      recentPosts: row.recentPostCount,
    },
  };
}

function normalizeWindow(window: HotspotWindow | undefined): HotspotWindow {
  return window ?? "DAY_1";
}
