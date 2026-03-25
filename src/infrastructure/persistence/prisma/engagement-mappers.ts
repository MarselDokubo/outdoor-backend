import type { Reaction } from "../../../domain/engagement/reaction.js";
import type { Save } from "../../../domain/engagement/save.js";
import { Reaction as ReactionEntity } from "../../../domain/engagement/reaction.js";
import { Save as SaveEntity } from "../../../domain/engagement/save.js";

interface ReactionRecord {
  id: string;
  userId: string;
  targetType: "PLACE" | "POST" | "EVENT";
  targetId: string;
  reactionType: "LIKE" | "INTERESTED" | "FIRE";
  createdAt: Date;
  updatedAt: Date;
}

interface SaveRecord {
  id: string;
  userId: string;
  targetType: "PLACE" | "POST" | "EVENT";
  targetId: string;
  createdAt: Date;
}

export function toReactionEntity(record: ReactionRecord): Reaction {
  return ReactionEntity.rehydrate({
    id: record.id,
    userId: record.userId,
    targetType: record.targetType,
    targetId: record.targetId,
    reactionType: record.reactionType,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

export function toReactionPersistence(reaction: Reaction) {
  const data = reaction.toObject();
  return {
    id: data.id,
    userId: data.userId,
    targetType: data.targetType,
    targetId: data.targetId,
    reactionType: data.reactionType,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function toSaveEntity(record: SaveRecord): Save {
  return SaveEntity.rehydrate({
    id: record.id,
    userId: record.userId,
    targetType: record.targetType,
    targetId: record.targetId,
    createdAt: record.createdAt,
  });
}

export function toSavePersistence(item: Save) {
  const data = item.toObject();
  return {
    id: data.id,
    userId: data.userId,
    targetType: data.targetType,
    targetId: data.targetId,
    createdAt: data.createdAt,
  };
}
