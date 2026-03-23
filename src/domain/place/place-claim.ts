import { PlaceConflictError } from "./place.errors.js";
import { type PlaceClaimStatus } from "./place.enums.js";
import {
  OwnershipProofReference,
  type OwnershipProofReferenceData,
  type OwnershipProofReferenceProps,
} from "./ownership-proof.js";

export interface CreatePlaceClaimProps {
  id: string;
  placeId: string;
  claimantUserId: string;
  proofReferences: OwnershipProofReferenceProps[];
  status?: PlaceClaimStatus | undefined;
  submittedAt?: Date | undefined;
  reviewedAt?: Date | null | undefined;
  reviewedByUserId?: string | null | undefined;
  reviewNotes?: string | null | undefined;
  updatedAt?: Date | undefined;
}

export interface RehydratePlaceClaimProps {
  id: string;
  placeId: string;
  claimantUserId: string;
  proofReferences: OwnershipProofReferenceData[];
  status: PlaceClaimStatus;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewedByUserId: string | null;
  reviewNotes: string | null;
  updatedAt: Date;
}

export class PlaceClaim {
  private constructor(
    public readonly id: string,
    public readonly placeId: string,
    public readonly claimantUserId: string,
    private proofReferences: OwnershipProofReference[],
    private status: PlaceClaimStatus,
    public readonly submittedAt: Date,
    private reviewedAt: Date | null,
    private reviewedByUserId: string | null,
    private reviewNotes: string | null,
    private updatedAt: Date,
  ) {}

  public static create(props: CreatePlaceClaimProps): PlaceClaim {
    if (!props.claimantUserId.trim()) {
      throw new PlaceConflictError("Claimant user id is required.");
    }
    if (!props.placeId.trim()) {
      throw new PlaceConflictError("Place id is required.");
    }
    if (props.proofReferences.length === 0) {
      throw new PlaceConflictError("At least one ownership proof is required.");
    }
    return new PlaceClaim(
      props.id,
      props.placeId,
      props.claimantUserId,
      props.proofReferences.map((item) => OwnershipProofReference.create(item)),
      props.status ?? "PENDING",
      props.submittedAt ?? new Date(),
      props.reviewedAt ?? null,
      props.reviewedByUserId ?? null,
      normalizeOptionalText(props.reviewNotes),
      props.updatedAt ?? new Date(),
    );
  }

  public static rehydrate(props: RehydratePlaceClaimProps): PlaceClaim {
    return new PlaceClaim(
      props.id,
      props.placeId,
      props.claimantUserId,
      props.proofReferences.map((item) => OwnershipProofReference.create(item)),
      props.status,
      props.submittedAt,
      props.reviewedAt,
      props.reviewedByUserId,
      props.reviewNotes,
      props.updatedAt,
    );
  }

  public moveToReview(): void {
    this.assertActive();
    this.status = "UNDER_REVIEW";
    this.touch();
  }

  public approve(reviewerUserId: string, reviewNotes?: string | null | undefined): void {
    this.assertReviewable();
    this.status = "APPROVED";
    this.reviewedAt = new Date();
    this.reviewedByUserId = reviewerUserId;
    this.reviewNotes = normalizeOptionalText(reviewNotes);
    this.touch();
  }

  public reject(reviewerUserId: string, reviewNotes?: string | null | undefined): void {
    this.assertReviewable();
    this.status = "REJECTED";
    this.reviewedAt = new Date();
    this.reviewedByUserId = reviewerUserId;
    this.reviewNotes = normalizeOptionalText(reviewNotes);
    this.touch();
  }

  public withdraw(): void {
    this.assertActive();
    this.status = "WITHDRAWN";
    this.touch();
  }

  public getStatus(): PlaceClaimStatus {
    return this.status;
  }

  public getProofReferences(): OwnershipProofReferenceData[] {
    return this.proofReferences.map((item) => item.toJSON());
  }

  public toPrimitives() {
    return {
      id: this.id,
      placeId: this.placeId,
      claimantUserId: this.claimantUserId,
      status: this.status,
      proofReferences: this.getProofReferences(),
      submittedAt: this.submittedAt,
      reviewedAt: this.reviewedAt,
      reviewedByUserId: this.reviewedByUserId,
      reviewNotes: this.reviewNotes,
      updatedAt: this.updatedAt,
    };
  }

  private assertActive(): void {
    if (["APPROVED", "REJECTED", "WITHDRAWN"].includes(this.status)) {
      throw new PlaceConflictError("Completed claims can no longer change status.");
    }
  }

  private assertReviewable(): void {
    if (!["PENDING", "UNDER_REVIEW"].includes(this.status)) {
      throw new PlaceConflictError("Only pending claims can be reviewed.");
    }
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || null;
}
