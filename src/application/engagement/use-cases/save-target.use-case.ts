import { newId } from "../../../shared/ids.js";
import { Save } from "../../../domain/engagement/save.js";
import type { SaveRepository } from "../../../domain/engagement/repositories/index.js";
import type { SaveTargetCommand, SaveView } from "../contracts.js";
import type { EngagementTargetAccessService } from "./query-services.js";

export class SaveTargetUseCase {
  constructor(
    private readonly saveRepository: SaveRepository,
    private readonly targetAccessService: EngagementTargetAccessService,
  ) {}

  public async execute(command: SaveTargetCommand): Promise<SaveView> {
    await this.targetAccessService.assertTargetViewable({
      actorUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    const existing = await this.saveRepository.findByUserAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );

    if (existing) {
      return toView(existing);
    }

    const item = Save.create({
      id: newId("save"),
      userId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    await this.saveRepository.save(item);
    return toView(item);
  }
}

function toView(item: Save): SaveView {
  const data = item.toObject();
  return {
    id: data.id,
    userId: data.userId,
    targetType: data.targetType,
    targetId: data.targetId,
    createdAt: data.createdAt.toISOString(),
  };
}
