import { newId } from "../../../shared/ids.js";
import { Reaction } from "../../../domain/engagement/reaction.js";
import type { ReactionRepository } from "../../../domain/engagement/repositories/index.js";
import type { ReactToTargetCommand, ReactionView } from "../contracts.js";
import type { EngagementTargetAccessService } from "./query-services.js";

export class ReactToTargetUseCase {
  constructor(
    private readonly reactionRepository: ReactionRepository,
    private readonly targetAccessService: EngagementTargetAccessService,
  ) {}

  public async execute(command: ReactToTargetCommand): Promise<ReactionView> {
    await this.targetAccessService.assertTargetViewable({
      actorUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    const existing = await this.reactionRepository.findByUserAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );

    if (existing) {
      existing.changeReactionType(command.reactionType);
      await this.reactionRepository.save(existing);
      return toView(existing);
    }

    const reaction = Reaction.create({
      id: newId("reaction"),
      userId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
      reactionType: command.reactionType,
    });

    await this.reactionRepository.save(reaction);
    return toView(reaction);
  }
}

function toView(reaction: Reaction): ReactionView {
  const data = reaction.toObject();
  return {
    id: data.id,
    userId: data.userId,
    targetType: data.targetType,
    targetId: data.targetId,
    reactionType: data.reactionType,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
