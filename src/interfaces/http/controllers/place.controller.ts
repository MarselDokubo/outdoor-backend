import type { Request, Response } from "express";
import { ZodError } from "zod";
import type { PlaceActor } from "../../../domain/place/place-actor.js";
import { UnauthorizedError, AppError } from "../../../shared/errors/app-error.js";
import type { buildPlaceModule } from "../../../application/place/place.module.js";

export type PlaceHandlers = ReturnType<typeof buildPlaceModule>;

export class PlaceController {
  constructor(private readonly handlers: PlaceHandlers) {}

  public getActor(req: Request): PlaceActor | null {
    const source = (req as any).currentUser ?? (req as any).user ?? (req as any).auth ?? null;
    if (!source) return null;
    const userId = source.id ?? source.userId ?? source.sub ?? source.subject ?? null;
    const rolesRaw = source.roles ?? source.systemRoles ?? source.roleAssignments ?? [];
    const roles = Array.isArray(rolesRaw)
      ? rolesRaw
          .map((item: any) =>
            typeof item === "string" ? item : (item?.role ?? item?.name ?? item?.systemRole),
          )
          .filter(Boolean)
      : [];
    return typeof userId === "string" ? { userId, roles } : null;
  }

  public requireActor(req: Request): PlaceActor {
    const actor = this.getActor(req);
    if (!actor) throw new UnauthorizedError("Authentication is required for this endpoint.");
    return actor;
  }

  public sendError(res: Response, error: unknown): void {
    if (error instanceof ZodError) {
      res
        .status(422)
        .json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details: error.flatten(),
          },
        });
      return;
    }
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ error: { code: error.code, message: error.message, details: error.details } });
      return;
    }
    res
      .status(500)
      .json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unexpected error.",
        },
      });
  }
}
