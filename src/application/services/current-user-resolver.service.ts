import type { AuthIdentityRepository } from "../../domain/user/repositories/auth-identity.repository";
import type { UserRepository } from "../../domain/user/repositories/user.repository";
import type { AuthContext } from "../../shared/auth/auth-context";
import type { CurrentUserContext } from "../../shared/auth/current-user-context";

export class CurrentUserResolverService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authIdentityRepository: AuthIdentityRepository,
  ) {}

  async resolve(auth: AuthContext): Promise<CurrentUserContext> {
    const provider = auth.issuer;
    const providerSubject = auth.subject;

    const existingIdentity = await this.authIdentityRepository.findByProviderSubject({
      provider,
      providerSubject,
    });

    if (!existingIdentity) {
      const user = await this.userRepository.create({
        email: auth.email ?? null,
        role: "user",
      });

      const identity = await this.authIdentityRepository.create({
        userId: user.id,
        provider,
        providerSubject,
        providerEmail: auth.email ?? null,
        emailVerified: auth.emailVerified ?? null,
        lastLoginAt: new Date(),
      });

      return this.toCurrentUserContext(identity.user, auth);
    }

    const updatedIdentity = await this.authIdentityRepository.updateLogin(existingIdentity.id, {
      providerEmail: auth.email ?? null,
      emailVerified: auth.emailVerified ?? null,
      lastLoginAt: new Date(),
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
