import type { ListMyFollowsQuery, ListMyFollowsResult } from "../follow.contracts.js";
import type { FollowQueryService } from "./follow-query-services.js";

export class ListMyFollowsUseCase {
  constructor(private readonly queryService: FollowQueryService) {}

  public async execute(query: ListMyFollowsQuery): Promise<ListMyFollowsResult> {
    return this.queryService.listByFollowerUserId({
      followerUserId: query.actorUserId,
      ...(query.targetType !== undefined ? { targetType: query.targetType } : {}),
      limit: query.limit ?? 20,
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
  }
}
