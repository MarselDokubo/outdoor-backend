import type { Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export function sendError(response: Response, error: unknown): void {
  if (error instanceof ZodError) {
    response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: error.flatten(),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  const fallbackMessage = error instanceof Error ? error.message : "Unexpected error.";
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: fallbackMessage,
    },
  });
}
