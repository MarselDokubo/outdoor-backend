import type {
  HotPlaceView,
  HotspotCellView,
  HotspotWindow,
  NearbyHotspotsQuery,
  NearbyHotspotsView,
} from "../contracts.js";
import type { HotspotQueryRow, HotspotQueryService } from "./query-services.js";
import { scoreHotspot } from "../../../domain/hotspot/hotspot-score.js";
import type { H3GridPort } from "../../../infrastructure/h3/h3-grid.service.js";

export class ListNearbyHotspotsUseCase {
  constructor(
    private readonly queryService: HotspotQueryService,
    private readonly h3Grid: H3GridPort,
  ) {}

  public async execute(query: NearbyHotspotsQuery): Promise<NearbyHotspotsView> {
    const window = normalizeWindow(query.window);
    const limit = clamp(query.limit ?? 20, 1, 50);
    const generatedAt = new Date();

    const rows = await this.queryService.findNearbyPlaceSignals({
      latitude: query.latitude,
      longitude: query.longitude,
      radiusMeters: query.radiusMeters,
      limit: Math.max(limit * 4, 50),
      window,
    });

    const items = rows
      .map((row) => this.toHotPlaceView(row, window, generatedAt))
      .sort(
        (left, right) =>
          right.score - left.score ||
          (left.distanceMeters ?? Number.MAX_SAFE_INTEGER) -
            (right.distanceMeters ?? Number.MAX_SAFE_INTEGER),
      )
      .slice(0, limit);

    return {
      window,
      generatedAt: generatedAt.toISOString(),
      items,
      cells: toHotspotCells(items, this.h3Grid),
    };
  }

  private toHotPlaceView(
    row: HotspotQueryRow,
    window: HotspotWindow,
    generatedAt: Date,
  ): HotPlaceView {
    const scored = scoreHotspot(row, window);
    const h3Cell = this.h3Grid.cellFor(row.latitude, row.longitude);

    return {
      placeId: row.placeId,
      slug: row.slug,
      name: row.name,
      categoryCode: row.categoryCode,
      latitude: row.latitude,
      longitude: row.longitude,
      distanceMeters: row.distanceMeters,
      h3Cell,
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
}

function toHotspotCells(items: HotPlaceView[], h3Grid: H3GridPort): HotspotCellView[] {
  const grouped = new Map<string, HotPlaceView[]>();

  for (const item of items) {
    const collection = grouped.get(item.h3Cell) ?? [];
    collection.push(item);
    grouped.set(item.h3Cell, collection);
  }

  return [...grouped.entries()]
    .map(([h3Cell, values]) => {
      const [centerLatitude, centerLongitude] = h3Grid.centerFor(h3Cell);
      return {
        h3Cell,
        centerLatitude,
        centerLongitude,
        score: Math.round(values.reduce((sum, item) => sum + item.score, 0) * 100) / 100,
        placeCount: values.length,
        topPlaceIds: values
          .sort((left, right) => right.score - left.score)
          .slice(0, 5)
          .map((item) => item.placeId),
      };
    })
    .sort((left, right) => right.score - left.score);
}

function normalizeWindow(window: HotspotWindow | undefined): HotspotWindow {
  return window ?? "DAY_1";
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
}
