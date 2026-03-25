import { EngagementValidationError } from "./engagement.errors.js";
import type { EngagementTargetType } from "./engagement.enums.js";

export interface SaveProps {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
  createdAt: Date;
}

export interface CreateSaveProps {
  id: string;
  userId: string;
  targetType: EngagementTargetType;
  targetId: string;
}

export class Save {
  private constructor(private props: SaveProps) {}

  public static create(props: CreateSaveProps): Save {
    validateId(props.userId, "Save user is required.");
    validateId(props.targetId, "Save target is required.");

    return new Save({
      id: props.id,
      userId: props.userId,
      targetType: props.targetType,
      targetId: props.targetId,
      createdAt: new Date(),
    });
  }

  public static rehydrate(props: SaveProps): Save {
    return new Save(props);
  }

  public toObject(): SaveProps {
    return { ...this.props };
  }
}

function validateId(value: string, message: string): void {
  if (!value || !value.trim()) {
    throw new EngagementValidationError(message);
  }
}
