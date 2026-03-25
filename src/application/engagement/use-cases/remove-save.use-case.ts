import type { SaveRepository } from "../../../domain/engagement/repositories/index.js";
import type { RemoveSaveCommand } from "../contracts.js";

export class RemoveSaveUseCase {
  constructor(private readonly saveRepository: SaveRepository) {}

  public async execute(command: RemoveSaveCommand): Promise<void> {
    await this.saveRepository.deleteByUserAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );
  }
}
