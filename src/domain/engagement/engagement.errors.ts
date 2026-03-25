import { AppError } from "../../shared/errors/app-error.js";

export class EngagementValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "ENGAGEMENT_VALIDATION_ERROR", details);
    this.name = "EngagementValidationError";
  }
}

export class EngagementAccessDeniedError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "ENGAGEMENT_ACCESS_DENIED");
    this.name = "EngagementAccessDeniedError";
  }
}

export class EngagementTargetNotFoundError extends AppError {
  constructor(message = "Engageable target not found") {
    super(message, 404, "ENGAGEMENT_TARGET_NOT_FOUND");
    this.name = "EngagementTargetNotFoundError";
  }
}
