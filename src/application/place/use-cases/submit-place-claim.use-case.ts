import { newId } from "../../../shared/ids.js";
import { ConflictError, NotFoundError } from "../../../shared/errors/app-error.js";
import type { SubmitPlaceClaimCommand } from "../contracts.js";
import type { PlacesTransactionManager } from "../../../domain/place/repositories/index.js";
import { PlaceClaim } from "../../../domain/place/place-claim.js";

export class SubmitPlaceClaimHandler {
  constructor(private readonly transactionManager: PlacesTransactionManager) {}

  public async execute(
    command: SubmitPlaceClaimCommand,
  ): Promise<{ claimId: string; placeId: string; status: string }> {
    return this.transactionManager.withTransaction(async ({ places, claims }) => {
      const place = await places.findById(command.placeId);
      if (!place) {
        throw new NotFoundError("Place not found.");
      }

      const existingMembership = await places.getActiveMembership(
        command.placeId,
        command.actor.userId,
      );
      if (existingMembership) {
        throw new ConflictError("This user already manages the place.");
      }

      const existingClaim = await claims.findPendingClaimForPlaceAndUser(
        command.placeId,
        command.actor.userId,
      );
      if (existingClaim) {
        throw new ConflictError(
          "There is already an active pending claim for this user and place.",
        );
      }

      const claim = PlaceClaim.create({
        id: newId("claim"),
        placeId: command.placeId,
        claimantUserId: command.actor.userId,
        proofReferences: command.proofReferences,
      });

      place.markClaimPending();
      await places.save(place);
      await claims.save(claim);

      return {
        claimId: claim.id,
        placeId: command.placeId,
        status: claim.getStatus(),
      };
    });
  }
}
