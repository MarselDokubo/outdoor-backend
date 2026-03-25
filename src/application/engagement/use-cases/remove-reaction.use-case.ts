import type { ReactionRepository } from "../../../domain/engagement/repositories/index.js";
import type { RemoveReactionCommand } from "../contracts.js";

export class RemoveReactionUseCase {
  constructor(private readonly reactionRepository: ReactionRepository) {}

  public async execute(command: RemoveReactionCommand): Promise<void> {
    await this.reactionRepository.deleteByUserAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );
  }
}
