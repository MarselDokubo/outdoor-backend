export type HotspotWindow = "LIVE_3H" | "DAY_1";

export interface NearbyHotspotsQuery {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  limit?: number;
  window?: HotspotWindow;
  actorUserId?: string | null;
}

export interface PlaceHotspotQuery {
  placeId: string;
  window?: HotspotWindow;
  actorUserId?: string | null;
}

export interface HotspotSignalBreakdownView {
  visits: number;
  reactions: number;
  comments: number;
  saves: number;
  impressions: number;
  follows: number;
  activeEvents: number;
  recentPosts: number;
}

export interface HotPlaceView {
  placeId: string;
  slug: string;
  name: string;
  categoryCode: string;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  h3Cell: string;
  score: number;
  generatedAt: string;
  lastSignalAt: string | null;
  reasons: string[];
  signals: HotspotSignalBreakdownView;
}

export interface HotspotCellView {
  h3Cell: string;
  centerLatitude: number;
  centerLongitude: number;
  score: number;
  placeCount: number;
  topPlaceIds: string[];
}

export interface NearbyHotspotsView {
  window: HotspotWindow;
  generatedAt: string;
  items: HotPlaceView[];
  cells: HotspotCellView[];
}

export interface PlaceHotspotView {
  window: HotspotWindow;
  generatedAt: string;
  item: HotPlaceView | null;
}
