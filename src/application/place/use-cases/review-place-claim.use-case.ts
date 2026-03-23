import { newId } from "../../../shared/ids.js";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canReviewClaims } from "../../../domain/place/place-access.js";
import type { ReviewPlaceClaimCommand } from "../contracts.js";
import type { PlacesTransactionManager } from "../../../domain/place/repositories/index.js";

export class ReviewPlaceClaimHandler {
  constructor(private readonly transactionManager: PlacesTransactionManager) {}

  public async execute(command: ReviewPlaceClaimCommand): Promise<{
    claimId: string;
    placeId: string;
    status: string;
  }> {
    if (!canReviewClaims(command.actor)) {
      throw new ForbiddenError("Only staff can review place claims.");
    }

    return this.transactionManager.withTransaction(async ({ places, claims }) => {
      const claim = await claims.findById(command.claimId);
      if (!claim) {
        throw new NotFoundError("Place claim not found.");
      }

      const place = await places.findById(claim.placeId);
      if (!place) {
        throw new NotFoundError("Place not found.");
      }

      if (command.decision === "APPROVE") {
        claim.approve(command.actor.userId, command.reviewNotes);
        place.markOwnerManagedVerified();
        await places.createOrReplaceMembership({
          id: newId("membership"),
          placeId: claim.placeId,
          userId: claim.claimantUserId,
          role: command.roleOnApproval ?? "OWNER",
          grantedByUserId: command.actor.userId,
        });
        await places.save(place);
        await claims.save(claim);
      } else {
        claim.reject(command.actor.userId, command.reviewNotes);
        await claims.save(claim);
      }

      return {
        claimId: claim.id,
        placeId: claim.placeId,
        status: claim.getStatus(),
      };
    });
  }
}
