import type { EngagementQueryService } from "./query-services.js";
import type { ListMySavedItemsQuery, SaveView } from "../contracts.js";

export class ListMySavedItemsUseCase {
  constructor(private readonly queryService: EngagementQueryService) {}

  public async execute(query: ListMySavedItemsQuery): Promise<SaveView[]> {
    return this.queryService.listMySavedItems(query);
  }
}
