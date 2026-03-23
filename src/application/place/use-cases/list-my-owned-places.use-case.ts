import type { ListMyOwnedPlacesQuery, PlaceMarkerView } from "../contracts.js";
import type { PlaceQueryService } from "./query-services.js";

export class ListMyOwnedPlacesHandler {
  constructor(private readonly queryService: PlaceQueryService) {}

  public execute(query: ListMyOwnedPlacesQuery): Promise<PlaceMarkerView[]> {
    return this.queryService.listMyOwnedPlaces(query.actor.userId);
  }
}
