import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canManagePlace } from "../../../domain/place/place-access.js";
import type { PublishPlaceCommand, PlaceMutationResult } from "../contracts.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";

export class PublishPlaceHandler {
  constructor(private readonly places: PlaceRepository) {}

  public async execute(command: PublishPlaceCommand): Promise<PlaceMutationResult> {
    const place = await this.places.findById(command.placeId);
    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = await this.places.getActiveMembership(command.placeId, command.actor.userId);
    if (!canManagePlace(command.actor, membership)) {
      throw new ForbiddenError("You do not have permission to publish this place.");
    }

    place.publish();
    await this.places.save(place);

    return {
      placeId: place.id,
      slug: place.getSlug(),
      publicationStatus: place.getPublicationStatus(),
      visibility: place.getVisibility(),
    };
  }
}
