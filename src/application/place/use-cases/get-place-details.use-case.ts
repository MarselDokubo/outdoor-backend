import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error.js";
import type { Actor } from "../../../domain/place/place-actor.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import { canViewPlaceDetail } from "../../../domain/place/place-access.js";
import type { PlaceQueryService } from "./query-services.js";
import type { PlaceDetailsView } from "../contracts.js";

export class GetPlaceDetailsHandler {
  constructor(
    private readonly queryService: PlaceQueryService,
    private readonly places: PlaceRepository,
  ) {}

  public async execute(input: {
    actor?: Actor | null | undefined;
    placeId?: string;
    slug?: string;
  }): Promise<PlaceDetailsView> {
    const view = input.placeId
      ? await this.queryService.getPlaceDetailsById(input.placeId)
      : await this.queryService.getPlaceDetailsBySlug(input.slug ?? "");

    if (!view) {
      throw new NotFoundError("Place not found.");
    }

    const membership = input.actor?.userId
      ? await this.places.getActiveMembership(view.id, input.actor.userId)
      : null;

    if (
      !canViewPlaceDetail({
        actor: input.actor ?? null,
        publicationStatus: view.publicationStatus as "DRAFT" | "PUBLISHED" | "ARCHIVED",
        visibility: view.visibility as "PUBLIC" | "UNLISTED" | "PRIVATE",
        membership,
      })
    ) {
      throw new ForbiddenError("You do not have access to this place.");
    }

    return {
      ...view,
      canCurrentViewerManage: Boolean(membership?.status === "ACTIVE"),
    };
  }
}
