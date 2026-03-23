import { OWNERSHIP_PROOF_KINDS, type OwnershipProofKind } from "./place.enums.js";
import { PlaceValidationError } from "./place.errors.js";

export interface OwnershipProofReferenceProps {
  kind: OwnershipProofKind;
  fileKey: string;
  originalFilename?: string | null | undefined;
  note?: string | null | undefined;
}

export interface OwnershipProofReferenceData {
  kind: OwnershipProofKind;
  fileKey: string;
  originalFilename: string | null;
  note: string | null;
}

export class OwnershipProofReference {
  private constructor(private readonly props: OwnershipProofReferenceData) {}

  public static create(props: OwnershipProofReferenceProps): OwnershipProofReference {
    if (!OWNERSHIP_PROOF_KINDS.includes(props.kind)) {
      throw new PlaceValidationError("Invalid ownership proof kind.", {
        allowedValues: OWNERSHIP_PROOF_KINDS,
      });
    }

    const fileKey = props.fileKey.trim();
    if (!fileKey) {
      throw new PlaceValidationError("Ownership proof file key is required.");
    }

    return new OwnershipProofReference({
      kind: props.kind,
      fileKey,
      originalFilename: normalizeOptionalText(props.originalFilename),
      note: normalizeOptionalText(props.note),
    });
  }

  public toJSON(): OwnershipProofReferenceData {
    return this.props;
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || null;
}
