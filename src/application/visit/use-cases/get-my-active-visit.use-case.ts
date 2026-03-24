import type { Actor } from "../../../domain/visit/visit-actor.js";
import type { ActiveVisitView } from "../contracts.js";
import type { VisitQueryService } from "./query-services.js";

export class GetMyActiveVisitHandler {
  constructor(private readonly queries: VisitQueryService) {}

  public async execute(actor: Actor): Promise<ActiveVisitView | null> {
    return this.queries.getActiveVisitForUser(actor.userId);
  }
}
