import type { FollowRepository } from "../../../domain/engagement/repositories/follow.repository.js";
import type { UnfollowTargetCommand } from "../follow.contracts.js";

export interface UnfollowTargetResult {
  success: true;
}

export class UnfollowTargetUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  public async execute(command: UnfollowTargetCommand): Promise<UnfollowTargetResult> {
    await this.followRepository.deleteByFollowerAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );

    return { success: true };
  }
}
