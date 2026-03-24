import { NotFoundError } from "../../../shared/errors/app-error.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { PlaceVisitSummaryView } from "../contracts.js";
import type { VisitQueryService } from "./query-services.js";

export class GetPlaceVisitSummaryHandler {
  constructor(
    private readonly places: PlaceRepository,
    private readonly queries: VisitQueryService,
  ) {}

  public async execute(placeId: string): Promise<PlaceVisitSummaryView> {
    const place = await this.places.findById(placeId);
    if (!place || place.getPublicationStatus() === "ARCHIVED") {
      throw new NotFoundError("Place not found.");
    }

    return this.queries.getPlaceVisitSummary(placeId);
  }
}
