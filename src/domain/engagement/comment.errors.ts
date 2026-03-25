import { AppError } from "../../shared/errors/app-error.js";

export class CommentValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "COMMENT_VALIDATION_ERROR", details);
    this.name = "CommentValidationError";
  }
}

export class CommentAccessDeniedError extends AppError {
  constructor(message = "Comment access denied") {
    super(message, 403, "COMMENT_ACCESS_DENIED");
    this.name = "CommentAccessDeniedError";
  }
}

export class CommentNotFoundError extends AppError {
  constructor(message = "Comment not found") {
    super(message, 404, "COMMENT_NOT_FOUND");
    this.name = "CommentNotFoundError";
  }
}
