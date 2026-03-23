import { ForbiddenError } from "../../../shared/errors/app-error.js";
import { canReviewClaims } from "../../../domain/place/place-access.js";
import type { ListPendingClaimsQuery, PendingPlaceClaimView } from "../contracts.js";
import type { PlaceQueryService } from "./query-services.js";

export class ListPendingPlaceClaimsHandler {
  constructor(private readonly queryService: PlaceQueryService) {}

  public async execute(query: ListPendingClaimsQuery): Promise<PendingPlaceClaimView[]> {
    if (!canReviewClaims(query.actor)) {
      throw new ForbiddenError("Only staff can view pending place claims.");
    }
    return this.queryService.listPendingClaims(query);
  }
}
