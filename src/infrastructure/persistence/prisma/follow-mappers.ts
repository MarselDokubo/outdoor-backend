import type { Follow as PrismaFollow } from "../../../generated/prisma/client.js";
import type { Follow } from "../../../domain/engagement/follow.js";
import { Follow as FollowEntity } from "../../../domain/engagement/follow.js";

export function toFollowEntity(record: PrismaFollow): Follow {
  return FollowEntity.rehydrate({
    id: record.id,
    followerUserId: record.followerUserId,
    targetType: record.targetType,
    targetId: record.targetId,
    createdAt: record.createdAt,
  });
}

export function toFollowPersistence(follow: Follow): PrismaFollow {
  const data = follow.toObject();

  return {
    id: data.id,
    followerUserId: data.followerUserId,
    targetType: data.targetType,
    targetId: data.targetId,
    createdAt: data.createdAt,
  };
}
