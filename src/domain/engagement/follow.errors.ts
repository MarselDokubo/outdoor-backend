import { AppError } from "../../shared/errors/app-error.js";

export class FollowValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "FOLLOW_VALIDATION_ERROR", details);
    this.name = "FollowValidationError";
  }
}

export class FollowAccessDeniedError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "FOLLOW_ACCESS_DENIED");
    this.name = "FollowAccessDeniedError";
  }
}

export class FollowTargetNotFoundError extends AppError {
  constructor(message = "Follow target not found") {
    super(message, 404, "FOLLOW_TARGET_NOT_FOUND");
    this.name = "FollowTargetNotFoundError";
  }
}
