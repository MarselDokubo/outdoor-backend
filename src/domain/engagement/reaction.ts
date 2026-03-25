import { EngagementValidationError } from "./engagement.errors.js";
import type { EngagementTargetType, ReactionType } from "./engagement.enums.js";

export interface ReactionProps {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
  reactionType: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReactionProps {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
  reactionType: ReactionType;
}

export class Reaction {
  private constructor(private props: ReactionProps) {}

  public static create(props: CreateReactionProps): Reaction {
    validateId(props.userId, "Reaction user is required.");
    validateId(props.targetId, "Reaction target is required.");

    const now = new Date();

    return new Reaction({
      id: props.id,
      userId: props.userId,
      targetType: props.targetType,
      targetId: props.targetId,
      reactionType: props.reactionType,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static rehydrate(props: ReactionProps): Reaction {
    return new Reaction(props);
  }

  public changeReactionType(nextReactionType: ReactionType): void {
    if (this.props.reactionType === nextReactionType) {
      return;
    }

    this.props = {
      ...this.props,
      reactionType: nextReactionType,
      updatedAt: new Date(),
    };
  }

  public toObject(): ReactionProps {
    return { ...this.props };
  }
}

function validateId(value: string, message: string): void {
  if (!value || !value.trim()) {
    throw new EngagementValidationError(message);
  }
}
