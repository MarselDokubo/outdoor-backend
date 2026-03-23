import { newId } from "../../../shared/ids.js";
import { ConflictError, ForbiddenError } from "../../../shared/errors/app-error.js";
import { isStaffActor } from "../../../domain/place/place-actor.js";
import { Place } from "../../../domain/place/place.js";
import type { CreatePlaceCommand, PlaceMutationResult } from "../contracts.js";
import type {
  PlaceSlugUniquenessService,
  PlacesTransactionManager,
} from "../../../domain/place/repositories/index.js";
import { PlaceClaim } from "../../../domain/place/place-claim.js";

export class CreatePlaceHandler {
  constructor(
    private readonly transactionManager: PlacesTransactionManager,
    private readonly slugService: PlaceSlugUniquenessService,
  ) {}

  public async execute(command: CreatePlaceCommand): Promise<PlaceMutationResult> {
    const slug = await this.slugService.generateUniqueSlug(command.name);
    const shouldPublish = Boolean(command.publishNow && isStaffActor(command.actor));

    if (command.publishNow && !isStaffActor(command.actor)) {
      throw new ForbiddenError("Only staff can publish a place during creation.");
    }

    return this.transactionManager.withTransaction(async ({ places, claims }) => {
      const place = Place.create({
        id: newId("place"),
        slug,
        name: command.name,
        category: command.category,
        descriptions: command.descriptions,
        contactDetails: command.contactDetails,
        location: command.location,
        visibility: command.visibility ?? "PRIVATE",
        publicationStatus: shouldPublish ? "PUBLISHED" : "DRAFT",
        createdByUserId: command.actor.userId,
        officialTagline: command.officialTagline,
        officialSummary: command.officialSummary,
        sourceType: "USER_SUBMITTED",
      });

      await places.save(place);

      if (command.submitClaim) {
        const proofs = command.proofReferences ?? [];
        if (proofs.length === 0) {
          throw new ConflictError("Proof of ownership is required when submitClaim is true.");
        }
        const existingClaim = await claims.findPendingClaimForPlaceAndUser(
          place.id,
          command.actor.userId,
        );
        if (existingClaim) {
          throw new ConflictError("There is already an active claim for this place by this user.");
        }
        const claim = PlaceClaim.create({
          id: newId("claim"),
          placeId: place.id,
          claimantUserId: command.actor.userId,
          proofReferences: proofs,
        });
        place.markClaimPending();
        await places.save(place);
        await claims.save(claim);
      }

      return {
        placeId: place.id,
        slug: place.getSlug(),
        publicationStatus: place.getPublicationStatus(),
        visibility: place.getVisibility(),
      };
    });
  }
}
