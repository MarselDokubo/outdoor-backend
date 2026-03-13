import type { PrismaClient } from "../../generated/prisma/client";
import type { AuthContext } from "../../shared/auth/auth-context";
import type { CurrentUserContext } from "../../shared/auth/current-user-context";

export class CurrentUserResolverService {
  constructor(private readonly prisma: PrismaClient) {}

  async resolve(auth: AuthContext): Promise<CurrentUserContext> {
    const provider = auth.issuer;
    const providerSubject = auth.subject;

    const existingIdentity = await this.prisma.authIdentity.findUnique({
      where: {
        provider_providerSubject: {
          provider,
          providerSubject,
        },
      },
      include: {
        user: true,
      },
    });

    if (!existingIdentity) {
      const createdUser = await this.prisma.user.create({
        data: {
          email: auth.email ?? null,
          role: "user",
        },
      });

      const createdIdentity = await this.prisma.authIdentity.create({
        data: {
          userId: createdUser.id,
          provider,
          providerSubject,
          providerEmail: auth.email ?? null,
          emailVerified: auth.emailVerified ?? null,
          lastLoginAt: new Date(),
        },
        include: {
          user: true,
        },
      });

      return this.toCurrentUserContext(createdIdentity.user, auth);
    }

    const updatedIdentity = await this.prisma.authIdentity.update({
      where: {
        id: existingIdentity.id,
      },
      data: {
        providerEmail: auth.email ?? null,
        emailVerified: auth.emailVerified ?? null,
        lastLoginAt: new Date(),
      },
      include: {
        user: true,
      },
    });

    return this.toCurrentUserContext(updatedIdentity.user, auth);
  }

  private toCurrentUserContext(
    user: {
      id: string;
      email: string | null;
      displayName: string | null;
      role: "user" | "creator" | "owner" | "admin";
      isActive: boolean;
    },
    auth: AuthContext,
  ): CurrentUserContext {
    return {
      userId: user.id,
      role: user.role,
      isActive: user.isActive,
      auth,
      ...(user.email ? { email: user.email } : {}),
      ...(user.displayName ? { displayName: user.displayName } : {}),
    };
  }
}
