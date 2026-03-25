import {
  EngagementAccessDeniedError,
  EngagementTargetNotFoundError,
} from "../../../domain/engagement/engagement.errors.js";
import type { EngagementTargetAccessService } from "../../../application/engagement/use-cases/query-services.js";
import type { EngagementTargetType } from "../../../domain/engagement/engagement.enums.js";
import type { EngagementPrismaClient } from "./engagement-prisma.types.js";

export class PrismaEngagementTargetAccessService implements EngagementTargetAccessService {
  constructor(private readonly prisma: EngagementPrismaClient) {}

  public async assertTargetViewable(input: {
    actorUserId?: string | null;
    targetType: EngagementTargetType;
    targetId: string;
  }): Promise<void> {
    switch (input.targetType) {
      case "PLACE":
        return this.assertPlaceViewable(input.targetId, input.actorUserId);
      case "POST":
        return this.assertPostViewable(input.targetId, input.actorUserId);
      case "EVENT":
        return this.assertEventViewable(input.targetId, input.actorUserId);
      default:
        throw new EngagementAccessDeniedError("Unsupported engagement target.");
    }
  }

  private async assertPlaceViewable(placeId: string, actorUserId?: string | null): Promise<void> {
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
      throw new EngagementTargetNotFoundError("Place not found.");
    }

    const isOwner = Boolean(actorUserId && place.createdByUserId === actorUserId);
    const isPubliclyVisible =
      place.publicationStatus === "PUBLISHED" &&
      (place.visibility === "PUBLIC" || place.visibility === "UNLISTED");

    if (!isOwner && !isPubliclyVisible) {
      throw new EngagementAccessDeniedError("Place is not viewable by this user.");
    }
  }

  private async assertPostViewable(postId: string, actorUserId?: string | null): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorUserId: true,
        publicationStatus: true,
        visibility: true,
      },
    });

    if (!post) {
      throw new EngagementTargetNotFoundError("Post not found.");
    }

    const isAuthor = Boolean(actorUserId && post.authorUserId === actorUserId);
    const isPubliclyVisible =
      post.publicationStatus === "PUBLISHED" &&
      (post.visibility === "PUBLIC" || post.visibility === "UNLISTED");

    if (!isAuthor && !isPubliclyVisible) {
      throw new EngagementAccessDeniedError("Post is not viewable by this user.");
    }
  }

  private async assertEventViewable(eventId: string, actorUserId?: string | null): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        hostUserId: true,
        status: true,
        visibility: true,
      },
    });

    if (!event) {
      throw new EngagementTargetNotFoundError("Event not found.");
    }

    const isHost = Boolean(actorUserId && event.hostUserId === actorUserId);
    const isPubliclyVisible =
      event.status === "PUBLISHED" &&
      (event.visibility === "PUBLIC" || event.visibility === "UNLISTED");

    if (!isHost && !isPubliclyVisible) {
      throw new EngagementAccessDeniedError("Event is not viewable by this user.");
    }
  }
}
