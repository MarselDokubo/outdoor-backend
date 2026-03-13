import type { CurrentUserContext } from "./current-user-context";

export function getCurrentUser(locals: Express.Locals): CurrentUserContext {
  const currentUser = locals.currentUser;

  if (!currentUser) {
    throw new Error(
      "Current user is missing. Ensure auth and user resolution middleware ran first.",
    );
  }

  return currentUser;
}
