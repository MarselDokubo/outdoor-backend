import type { NearbyPlacesQuery, PlaceMarkerView } from "../contracts.js";
import type { PlaceQueryService } from "./query-services.js";

export class FindNearbyPlacesHandler {
  constructor(private readonly queryService: PlaceQueryService) {}

  public execute(query: NearbyPlacesQuery): Promise<PlaceMarkerView[]> {
    return this.queryService.findNearbyPlaces(query);
  }
}
