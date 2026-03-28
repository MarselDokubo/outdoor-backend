import type { HotspotWindow } from "../contracts.js";

export interface HotspotQueryRow {
  placeId: string;
  slug: string;
  name: string;
  categoryCode: string;
  latitude: number;
  longitude: number;
  distanceMeters: number | null;
  visitCount: number;
  reactionCount: number;
  commentCount: number;
  saveCount: number;
  impressionCount: number;
  followCount: number;
  activeEventCount: number;
  recentPostCount: number;
  lastSignalAt: Date | null;
}

export interface NearbyHotspotQueryInput {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  limit: number;
  window: HotspotWindow;
}

export interface PlaceHotspotQueryInput {
  placeId: string;
  window: HotspotWindow;
}

export interface HotspotQueryService {
  findNearbyPlaceSignals(input: NearbyHotspotQueryInput): Promise<HotspotQueryRow[]>;
  findPlaceSignals(input: PlaceHotspotQueryInput): Promise<HotspotQueryRow | null>;
}
