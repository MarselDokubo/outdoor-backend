import { FollowValidationError } from "./follow.errors.js";
import type { FollowTargetType } from "./follow.enums.js";

export interface FollowProps {
  id: string;
  followerUserId: string;
  targetType: FollowTargetType;
  targetId: string;
  createdAt: Date;
}

export interface CreateFollowProps {
  id: string;
  followerUserId: string;
  targetType: FollowTargetType;
  targetId: string;
}

export class Follow {
  private constructor(private readonly props: FollowProps) {}

  public static create(props: CreateFollowProps): Follow {
    validateUserId(props.followerUserId, "Follower user id is required.");
    validateTargetId(props.targetId);

    if (props.targetType === "USER" && props.followerUserId === props.targetId) {
      throw new FollowValidationError("Users cannot follow themselves.");
    }

    return new Follow({
      id: props.id,
      followerUserId: props.followerUserId,
      targetType: props.targetType,
      targetId: props.targetId,
      createdAt: new Date(),
    });
  }

  public static rehydrate(props: FollowProps): Follow {
    return new Follow(props);
  }

  public belongsTo(userId: string): boolean {
    return this.props.followerUserId === userId;
  }

  public toObject(): FollowProps {
    return { ...this.props };
  }
}

function validateUserId(value: string, message: string): void {
  if (!value || !value.trim()) {
    throw new FollowValidationError(message);
  }
}

function validateTargetId(value: string): void {
  if (!value || !value.trim()) {
    throw new FollowValidationError("Target id is required.");
  }
}
