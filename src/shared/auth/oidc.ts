import { env } from "../../config/env";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { isUserRole, type UserRole } from "../../domain/user/user-role";
import type { AuthContext } from "./auth-context";

if (!env.OIDC_ISSUER) {
  throw new Error("OIDC_ISSUER is not set");
}

if (!env.OIDC_AUDIENCE) {
  throw new Error("OIDC_AUDIENCE is not set");
}

const issuer = env.OIDC_ISSUER;
const audience = env.OIDC_AUDIENCE;

let jwksResolverPromise: Promise<ReturnType<typeof createRemoteJWKSet>> | undefined;

async function getRemoteJwks() {
  if (!jwksResolverPromise) {
    jwksResolverPromise = (async () => {
      const wellKnownUrl = new URL("/.well-known/openid-configuration", issuer);

      const response = await fetch(wellKnownUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch OIDC discovery document: ${response.status}`);
      }

      const metadata = (await response.json()) as { jwks_uri?: string };

      if (!metadata.jwks_uri) {
        throw new Error("OIDC discovery document missing jwks_uri");
      }

      return createRemoteJWKSet(new URL(metadata.jwks_uri));
    })();
  }

  return jwksResolverPromise;
}

function extractRoles(claims: JWTPayload): UserRole[] {
  const rawRoles = new Set<string>();

  if (Array.isArray(claims.roles)) {
    for (const role of claims.roles) {
      if (typeof role === "string") {
        rawRoles.add(role);
      }
    }
  }

  const realmAccess = claims.realm_access as { roles?: unknown[] } | undefined;

  if (realmAccess && Array.isArray(realmAccess.roles)) {
    for (const role of realmAccess.roles) {
      if (typeof role === "string") {
        rawRoles.add(role);
      }
    }
  }

  return [...rawRoles].filter(isUserRole);
}

export async function verifyAccessToken(token: string): Promise<AuthContext> {
  const jwks = await getRemoteJwks();

  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience,
  });

  if (typeof payload.sub !== "string" || !payload.sub) {
    throw new Error("Token subject (sub) is missing");
  }

  if (typeof payload.iss !== "string" || !payload.iss) {
    throw new Error("Token issuer (iss) is missing");
  }
  return {
    provider: "oidc",
    subject: payload.sub,
    issuer: payload.iss,
    audience: payload.aud ?? audience,
    roles: extractRoles(payload),
    claims: payload,
    ...(typeof payload.email === "string" ? { email: payload.email } : {}),
    ...(typeof payload.email_verified === "boolean"
      ? { emailVerified: payload.email_verified }
      : {}),
  };
}
