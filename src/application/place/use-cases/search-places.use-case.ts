import type { SearchPlacesQuery, SearchPlacesResult } from "../contracts.js";
import type { PlaceQueryService } from "./query-services.js";

export class SearchPlacesHandler {
  constructor(private readonly queryService: PlaceQueryService) {}

  public execute(query: SearchPlacesQuery): Promise<SearchPlacesResult> {
    return this.queryService.searchPlaces(query);
  }
}
