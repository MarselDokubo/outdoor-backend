import type { Response } from "express";

type SuccessOptions = {
  statusCode?: number;
  meta?: Record<string, unknown>;
};

export function sendSuccess<T>(res: Response, data: T, options: SuccessOptions = {}): Response {
  const { statusCode = 200, meta } = options;

  return res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
    requestId: res.locals.requestId,
  });
}

export function sendError(
  res: Response,
  options: {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  },
): Response {
  const { statusCode, code, message, details } = options;

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    requestId: res.locals.requestId,
  });
}
