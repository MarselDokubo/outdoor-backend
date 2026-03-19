import type { AuthIdentityRepository } from "../../domain/user/repositories/auth-identity.repository";
import type { UserRepository } from "../../domain/user/repositories/user.repository";
import type { UserRoleAssignmentRepository } from "../../domain/user/repositories/user-role-assignment.repository";
import type { AuthContext } from "../../shared/auth/auth-context";
import type { CurrentUserContext } from "../../shared/auth/current-user-context";
import { ForbiddenError } from "../../shared/errors/app-error";

export class CurrentUserResolverService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly userRoleAssignmentRepository: UserRoleAssignmentRepository,
  ) {}

  async resolve(auth: AuthContext): Promise<CurrentUserContext> {
    const provider = auth.issuer;
    const providerSubject = auth.subject;
    const now = new Date();

    const existingIdentity = await this.authIdentityRepository.findByProviderSubject({
      provider,
      providerSubject,
    });

    if (!existingIdentity) {
      const user = await this.userRepository.create({
        email: auth.email ?? null,
        displayName: null,
        status: "active",
      });

      await this.userRoleAssignmentRepository.assign({
        userId: user.id,
        role: "user",
        reason: "Default role on first sign-in",
      });

      const identity = await this.authIdentityRepository.create({
        userId: user.id,
        provider,
        providerSubject,
        providerEmail: auth.email ?? null,
        emailVerified: auth.emailVerified ?? null,
        lastLoginAt: now,
      });

      const roles = await this.userRoleAssignmentRepository.listByUserId(user.id);

      return this.toCurrentUserContext(
        {
          id: identity.user.id,
          email: identity.user.email,
          displayName: identity.user.displayName,
          status: identity.user.status,
        },
        roles.map((r) => r.role),
        auth,
      );
    }

    const updatedIdentity = await this.authIdentityRepository.updateLogin(existingIdentity.id, {
      providerEmail: auth.email ?? null,
      emailVerified: auth.emailVerified ?? null,
      lastLoginAt: now,
    });

    const updatedUser = await this.userRepository.updateLoginMetadata(updatedIdentity.user.id, {
      email: auth.email ?? null,
      lastSeenAt: now,
    });

    if (updatedUser.status !== "active") {
      throw new ForbiddenError("User account is not active");
    }

    const roles = await this.userRoleAssignmentRepository.listByUserId(updatedUser.id);

    return this.toCurrentUserContext(
      updatedUser,
      roles.map((r) => r.role),
      auth,
    );
  }

  private toCurrentUserContext(
    user: {
      id: string;
      email: string | null;
      displayName: string | null;
      status: "active" | "suspended" | "deactivated";
    },
    roles: ("user" | "creator" | "moderator" | "admin" | "super_admin")[],
    auth: AuthContext,
  ): CurrentUserContext {
    return {
      userId: user.id,
      roles,
      status: user.status,
      auth,
      ...(user.email ? { email: user.email } : {}),
      ...(user.displayName ? { displayName: user.displayName } : {}),
    };
  }
}
