import type { TaggingPlacesQuery, PlaceMarkerView } from "../contracts.js";
import type { PlaceQueryService } from "./query-services.js";

export class SearchPlacesForTaggingHandler {
  constructor(private readonly queryService: PlaceQueryService) {}

  public execute(query: TaggingPlacesQuery): Promise<PlaceMarkerView[]> {
    return this.queryService.searchPlacesForTagging(query);
  }
}
