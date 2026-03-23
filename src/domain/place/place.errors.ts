import { ConflictError, ForbiddenError, ValidationError } from "../../shared/errors/app-error.js";

export class PlaceValidationError extends ValidationError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "PlaceValidationError";
  }
}

export class PlaceForbiddenError extends ForbiddenError {
  constructor(message: string) {
    super(message);
    this.name = "PlaceForbiddenError";
  }
}

export class PlaceConflictError extends ConflictError {
  constructor(message: string, details?: unknown) {
    super(message, details);
    this.name = "PlaceConflictError";
  }
}
