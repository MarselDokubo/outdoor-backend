import {
  FollowAccessDeniedError,
  FollowTargetNotFoundError,
  FollowValidationError,
} from "../../../domain/engagement/follow.errors.js";
import type { FollowTargetAccessService } from "../../../application/engagement/use-cases/follow-query-services.js";
import type { FollowTargetType } from "../../../domain/engagement/follow.enums.js";
import type { FollowPrismaClient } from "./follow-prisma.types.js";

export class PrismaFollowTargetAccessService implements FollowTargetAccessService {
  constructor(private readonly prisma: FollowPrismaClient) {}

  public async assertTargetFollowable(input: {
    actorUserId: string;
    targetType: FollowTargetType;
    targetId: string;
  }): Promise<void> {
    switch (input.targetType) {
      case "USER":
        return this.assertUserFollowable(input.actorUserId, input.targetId);
      case "PLACE":
        return this.assertPlaceViewable(input.targetId, input.actorUserId);
      default:
        throw new FollowAccessDeniedError("Unsupported follow target.");
    }
  }

  public async assertUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new FollowTargetNotFoundError("User not found.");
    }
  }

  public async assertPlaceViewable(placeId: string, actorUserId?: string | null): Promise<void> {
    const place = await this.prisma.place.findUnique({
      where: { id: placeId },
      select: {
        id: true,
        publicationStatus: true,
        visibility: true,
        createdByUserId: true,
      },
    });

    if (!place) {
      throw new FollowTargetNotFoundError("Place not found.");
    }

    const isOwner = Boolean(actorUserId && place.createdByUserId === actorUserId);
    const isPubliclyVisible =
      place.publicationStatus === "PUBLISHED" &&
      (place.visibility === "PUBLIC" || place.visibility === "UNLISTED");

    if (!isOwner && !isPubliclyVisible) {
      throw new FollowAccessDeniedError("Place is not viewable by this user.");
    }
  }

  private async assertUserFollowable(actorUserId: string, targetUserId: string): Promise<void> {
    if (actorUserId === targetUserId) {
      throw new FollowValidationError("Users cannot follow themselves.");
    }

    await this.assertUserExists(targetUserId);
  }
}
