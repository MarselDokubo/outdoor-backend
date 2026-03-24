import { VisitStateError, VisitValidationError } from "./visit.errors.js";
import type { VisitSourceType, VisitStatus } from "./visit.enums.js";

export interface CreateVisitProps {
  id: string;
  userId: string;
  placeId: string;
  sourceType?: VisitSourceType | undefined;
  status?: VisitStatus | undefined;
  startedAt?: Date | undefined;
  endedAt?: Date | null | undefined;
  confidenceScore?: number | null | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export type RehydrateVisitProps = CreateVisitProps;

export class Visit {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly placeId: string,
    private status: VisitStatus,
    private sourceType: VisitSourceType,
    private startedAt: Date,
    private endedAt: Date | null,
    private confidenceScore: number | null,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static start(props: CreateVisitProps): Visit {
    const entity = new Visit(
      props.id,
      normalizeRequiredId(props.userId, "Visit user id is required."),
      normalizeRequiredId(props.placeId, "Visit place id is required."),
      props.status ?? "ACTIVE",
      props.sourceType ?? "MANUAL_CHECK_IN",
      props.startedAt ?? new Date(),
      props.endedAt ?? null,
      normalizeConfidence(props.confidenceScore),
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );

    entity.assertValidState();
    return entity;
  }

  public static rehydrate(props: RehydrateVisitProps): Visit {
    return Visit.start(props);
  }

  public end(endedAt?: Date | undefined): void {
    if (this.status !== "ACTIVE") {
      throw new VisitStateError("Only active visits can be ended.");
    }

    const effectiveEndedAt = endedAt ?? new Date();
    if (effectiveEndedAt.getTime() < this.startedAt.getTime()) {
      throw new VisitValidationError("Visit end time cannot be earlier than the start time.");
    }

    this.status = "COMPLETED";
    this.endedAt = effectiveEndedAt;
    this.touch();
  }

  public cancel(cancelledAt?: Date | undefined): void {
    if (this.status !== "ACTIVE") {
      throw new VisitStateError("Only active visits can be cancelled.");
    }

    this.status = "CANCELLED";
    this.endedAt = cancelledAt ?? new Date();
    this.touch();
  }

  public getStatus(): VisitStatus {
    return this.status;
  }

  public getSourceType(): VisitSourceType {
    return this.sourceType;
  }

  public getStartedAt(): Date {
    return this.startedAt;
  }

  public getEndedAt(): Date | null {
    return this.endedAt;
  }

  public getConfidenceScore(): number | null {
    return this.confidenceScore;
  }

  public toPrimitives() {
    return {
      id: this.id,
      userId: this.userId,
      placeId: this.placeId,
      status: this.status,
      sourceType: this.sourceType,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      confidenceScore: this.confidenceScore,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private assertValidState(): void {
    if (this.status === "ACTIVE" && this.endedAt) {
      throw new VisitValidationError("Active visits cannot have an end time.");
    }

    if (["COMPLETED", "CANCELLED"].includes(this.status) && !this.endedAt) {
      throw new VisitValidationError("Completed or cancelled visits must have an end time.");
    }

    if (this.endedAt && this.endedAt.getTime() < this.startedAt.getTime()) {
      throw new VisitValidationError("Visit end time cannot be earlier than the start time.");
    }
  }
}

function normalizeRequiredId(value: string, message: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new VisitValidationError(message);
  }
  return normalized;
}

function normalizeConfidence(value?: number | null): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new VisitValidationError("Visit confidence score must be between 0 and 100.");
  }

  return Math.round(value);
}
