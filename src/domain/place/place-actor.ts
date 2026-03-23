export type PlaceActorRole = "USER" | "ADMIN" | "MODERATOR" | "SYSTEM" | string;

export interface PlaceActor {
  userId: string;
  roles: PlaceActorRole[];
}

export type Actor = PlaceActor;

export function isAuthenticatedActor(actor: PlaceActor | null | undefined): actor is PlaceActor {
  return Boolean(actor?.userId);
}

export function hasAnyRole(actor: PlaceActor | null | undefined, roles: PlaceActorRole[]): boolean {
  if (!actor) return false;
  return actor.roles.some((role) => roles.includes(role));
}

export function isStaffActor(actor: PlaceActor | null | undefined): boolean {
  return hasAnyRole(actor, ["ADMIN", "MODERATOR", "SYSTEM"]);
}

export function requireActor(actor: PlaceActor | null | undefined): PlaceActor {
  if (!actor) {
    throw new Error("Authenticated actor is required.");
  }
  return actor;
}
