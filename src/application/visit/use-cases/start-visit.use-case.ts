import { BadRequestError, NotFoundError } from "../../../shared/errors/app-error.js";
import { newId } from "../../../shared/ids.js";
import type { PlaceRepository } from "../../../domain/place/repositories/index.js";
import { Visit } from "../../../domain/visit/visit.js";
import type { VisitRepository } from "../../../domain/visit/repositories/index.js";
import type { StartVisitCommand, VisitMutationResult } from "../contracts.js";

export class StartVisitHandler {
  constructor(
    private readonly visits: VisitRepository,
    private readonly places: PlaceRepository,
  ) {}

  public async execute(command: StartVisitCommand): Promise<VisitMutationResult> {
    const place = await this.places.findById(command.placeId);
    if (!place || place.getPublicationStatus() === "ARCHIVED") {
      throw new NotFoundError("Place not found.");
    }

    const activeVisit = await this.visits.findActiveByUserId(command.actor.userId);
    if (activeVisit) {
      throw new BadRequestError("User already has an active visit.");
    }

    const visit = Visit.start({
      id: newId("visit"),
      userId: command.actor.userId,
      placeId: command.placeId,
      sourceType: command.sourceType ?? "MANUAL_CHECK_IN",
    });

    await this.visits.save(visit);

    const data = visit.toPrimitives();
    return {
      visitId: data.id,
      placeId: data.placeId,
      status: data.status,
      startedAt: data.startedAt.toISOString(),
      endedAt: data.endedAt ? data.endedAt.toISOString() : null,
    };
  }
}
