import type { AuthContext } from "./auth-context";

export function getAuthContext(locals: Express.Locals): AuthContext {
  const auth = locals.auth;

  if (!auth) {
    throw new Error(
      "Auth context is missing. Ensure requireAuth ran before accessing auth context.",
    );
  }

  return auth;
}
