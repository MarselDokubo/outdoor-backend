import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import { canManagePlace } from "../../../domain/place/place-access.js";
import type { UpdatePlaceCommand, PlaceMutationResult } from "../contracts.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";

export class UpdatePlaceHandler {
  constructor(private readonly places: PlaceRepository) {}

  public async execute(command: UpdatePlaceCommand): Promise<PlaceMutationResult> {
    const place = await this.places.findById(command.placeId);
    if (!place) {
      throw new NotFoundError("Place not found.");
    }

    const membership = await this.places.getActiveMembership(command.placeId, command.actor.userId);
    if (!canManagePlace(command.actor, membership)) {
      throw new ForbiddenError("You do not have permission to update this place.");
    }

    if (command.name) place.rename(command.name);
    if (command.category) place.recategorize(command.category);
    if (command.descriptions) place.updateDescriptions(command.descriptions);
    if (command.contactDetails) place.updateContactDetails(command.contactDetails);
    if (command.location) place.relocate(command.location);
    if (command.visibility) place.setVisibility(command.visibility);

    await this.places.save(place);

    return {
      placeId: place.id,
      slug: place.getSlug(),
      publicationStatus: place.getPublicationStatus(),
      visibility: place.getVisibility(),
    };
  }
}
