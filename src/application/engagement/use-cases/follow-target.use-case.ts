import { newId } from "../../../shared/ids.js";
import { Follow } from "../../../domain/engagement/follow.js";
import type { FollowRepository } from "../../../domain/engagement/repositories/follow.repository.js";
import type { FollowTargetCommand, FollowView } from "../follow.contracts.js";
import type { FollowTargetAccessService } from "./follow-query-services.js";

export class FollowTargetUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly targetAccessService: FollowTargetAccessService,
  ) {}

  public async execute(command: FollowTargetCommand): Promise<FollowView> {
    await this.targetAccessService.assertTargetFollowable({
      actorUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    const existing = await this.followRepository.findByFollowerAndTarget(
      command.actorUserId,
      command.targetType,
      command.targetId,
    );

    if (existing) {
      return toView(existing);
    }

    const follow = Follow.create({
      id: newId("follow"),
      followerUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    await this.followRepository.save(follow);

    return toView(follow);
  }
}

function toView(follow: Follow): FollowView {
  const data = follow.toObject();

  return {
    id: data.id,
    followerUserId: data.followerUserId,
    targetType: data.targetType,
    targetId: data.targetId,
    createdAt: data.createdAt.toISOString(),
  };
}
