import { ImpressionValidationError } from "./impression.errors.js";
import type { EngagementTargetType } from "./engagement.enums.js";

export interface ImpressionProps {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  viewerUserId: string | null;
  sessionKey: string | null;
  createdAt: Date;
}

export interface CreateImpressionProps {
  id: string;
  targetType: EngagementTargetType;
  targetId: string;
  viewerUserId?: string | null;
  sessionKey?: string | null;
  createdAt?: Date;
}

export class Impression {
  private constructor(private readonly props: ImpressionProps) {}

  public static create(props: CreateImpressionProps): Impression {
    const targetId = normalizeRequired(props.targetId, "Impression target id is required.");
    const viewerUserId = normalizeOptional(props.viewerUserId);
    const sessionKey = normalizeOptional(props.sessionKey);

    if (!viewerUserId && !sessionKey) {
      throw new ImpressionValidationError(
        "Impressions require either an authenticated viewer or a session key.",
      );
    }

    if (sessionKey && sessionKey.length < 8) {
      throw new ImpressionValidationError("Session key must be at least 8 characters.");
    }

    if (sessionKey && sessionKey.length > 120) {
      throw new ImpressionValidationError("Session key must not exceed 120 characters.");
    }

    return new Impression({
      id: props.id,
      targetType: props.targetType,
      targetId,
      viewerUserId,
      sessionKey,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  public static rehydrate(props: ImpressionProps): Impression {
    return new Impression(props);
  }

  public toObject(): ImpressionProps {
    return { ...this.props };
  }
}

function normalizeOptional(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeRequired(value: string | null | undefined, message: string): string {
  const normalized = normalizeOptional(value);

  if (!normalized) {
    throw new ImpressionValidationError(message);
  }

  return normalized;
}
