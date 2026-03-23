import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canManagePlace } from "../../../domain/place/place-access.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import type { PlaceMutationResult, UpdateOfficialPlaceProfileCommand } from "../contracts.js";

export class UpdateOfficialPlaceProfileHandler {
  constructor(private readonly places: PlaceRepository) {}

  public async execute(command: UpdateOfficialPlaceProfileCommand): Promise<PlaceMutationResult> {
    const place = await this.places.findById(command.placeId);
    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = await this.places.getActiveMembership(command.placeId, command.actor.userId);
    if (!canManagePlace(command.actor, membership)) {
      throw new ForbiddenError("You do not have permission to manage the official profile.");
    }

    place.updateOfficialProfile({
      officialTagline: command.officialTagline,
      officialSummary: command.officialSummary,
      descriptions: command.descriptions,
      contactDetails: command.contactDetails,
    });

    await this.places.save(place);

    return {
      placeId: place.id,
      slug: place.getSlug(),
      publicationStatus: place.getPublicationStatus(),
      visibility: place.getVisibility(),
    };
  }
}
