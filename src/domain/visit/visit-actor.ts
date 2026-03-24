export type VisitActorRole = string;

export interface VisitActor {
  userId: string;
  roles: VisitActorRole[];
}

export type Actor = VisitActor;

export function isStaffActor(actor: VisitActor | null | undefined): boolean {
  if (!actor) return false;

  return actor.roles.some((role) =>
    ["admin", "moderator", "system", "ADMIN", "MODERATOR", "SYSTEM"].includes(role),
  );
}
