import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canManagePlace } from "../../../domain/place/place-access.js";
import type { ArchivePlaceCommand, PlaceMutationResult } from "../contracts.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";

export class ArchivePlaceHandler {
  constructor(private readonly places: PlaceRepository) {}

  public async execute(command: ArchivePlaceCommand): Promise<PlaceMutationResult> {
    const place = await this.places.findById(command.placeId);
    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = await this.places.getActiveMembership(command.placeId, command.actor.userId);
    if (!canManagePlace(command.actor, membership)) {
      throw new ForbiddenError("You do not have permission to archive this place.");
    }

    place.archive();
    await this.places.save(place);

    return {
      placeId: place.id,
      slug: place.getSlug(),
      publicationStatus: place.getPublicationStatus(),
      visibility: place.getVisibility(),
    };
  }
}
