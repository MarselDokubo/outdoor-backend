import type {
  ListPendingClaimsQuery,
  PendingPlaceClaimView,
  PlaceDetailsView,
  PlaceMarkerView,
  SearchPlacesQuery,
  SearchPlacesResult,
  NearbyPlacesQuery,
  TaggingPlacesQuery,
} from "../contracts.js";

export interface PlaceQueryService {
  getPlaceDetailsById(placeId: string): Promise<PlaceDetailsView | null>;
  getPlaceDetailsBySlug(slug: string): Promise<PlaceDetailsView | null>;
  searchPlaces(query: SearchPlacesQuery): Promise<SearchPlacesResult>;
  findNearbyPlaces(query: NearbyPlacesQuery): Promise<PlaceMarkerView[]>;
  searchPlacesForTagging(query: TaggingPlacesQuery): Promise<PlaceMarkerView[]>;
  listMyOwnedPlaces(userId: string): Promise<PlaceMarkerView[]>;
  listPendingClaims(query: ListPendingClaimsQuery): Promise<PendingPlaceClaimView[]>;
}
