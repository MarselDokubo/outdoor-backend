import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/errors/app-error.js";
import type { VisitRepository } from "../../../domain/visit/repositories/index.js";
import { isStaffActor } from "../../../domain/visit/visit-actor.js";
import type { EndVisitCommand, VisitMutationResult } from "../contracts.js";

export class EndVisitHandler {
  constructor(private readonly visits: VisitRepository) {}

  public async execute(command: EndVisitCommand): Promise<VisitMutationResult> {
    const visit = await this.visits.findById(command.visitId);
    if (!visit) {
      throw new NotFoundError("Visit not found.");
    }

    if (visit.userId !== command.actor.userId && !isStaffActor(command.actor)) {
      throw new ForbiddenError("You cannot end this visit.");
    }

    if (visit.getStatus() !== "ACTIVE") {
      throw new BadRequestError("Only active visits can be ended.");
    }

    visit.end();
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
