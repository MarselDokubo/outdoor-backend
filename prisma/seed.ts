import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function ensureRoles(
  userId: string,
  roles: ("user" | "creator" | "moderator" | "admin" | "super_admin")[],
) {
  for (const role of roles) {
    await prisma.userRoleAssignment.upsert({
      where: {
        userId_role: {
          userId,
          role,
        },
      },
      update: {},
      create: {
        userId,
        role,
        reason: "Seed role assignment",
      },
    });
  }
}

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@outdoor.local" },
    update: {
      displayName: "Platform Admin",
      status: "active",
      lastSeenAt: new Date(),
    },
    create: {
      email: "admin@outdoor.local",
      displayName: "Platform Admin",
      status: "active",
      lastSeenAt: new Date(),
    },
  });

  await ensureRoles(adminUser.id, ["user", "admin"]);

  await prisma.authIdentity.upsert({
    where: {
      provider_providerSubject: {
        provider: "seed",
        providerSubject: "admin@outdoor.local",
      },
    },
    update: {
      providerEmail: "admin@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
    create: {
      userId: adminUser.id,
      provider: "seed",
      providerSubject: "admin@outdoor.local",
      providerEmail: "admin@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
  });

  const creatorUser = await prisma.user.upsert({
    where: { email: "owner@outdoor.local" },
    update: {
      displayName: "Venue Owner",
      status: "active",
      lastSeenAt: new Date(),
    },
    create: {
      email: "owner@outdoor.local",
      displayName: "Venue Owner",
      status: "active",
      lastSeenAt: new Date(),
    },
  });

  await ensureRoles(creatorUser.id, ["user", "creator"]);

  await prisma.authIdentity.upsert({
    where: {
      provider_providerSubject: {
        provider: "seed",
        providerSubject: "owner@outdoor.local",
      },
    },
    update: {
      providerEmail: "owner@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
    create: {
      userId: creatorUser.id,
      provider: "seed",
      providerSubject: "owner@outdoor.local",
      providerEmail: "owner@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: "user@outdoor.local" },
    update: {
      displayName: "Sample User",
      status: "active",
      lastSeenAt: new Date(),
    },
    create: {
      email: "user@outdoor.local",
      displayName: "Sample User",
      status: "active",
      lastSeenAt: new Date(),
    },
  });

  await ensureRoles(normalUser.id, ["user"]);

  await prisma.authIdentity.upsert({
    where: {
      provider_providerSubject: {
        provider: "seed",
        providerSubject: "user@outdoor.local",
      },
    },
    update: {
      providerEmail: "user@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
    create: {
      userId: normalUser.id,
      provider: "seed",
      providerSubject: "user@outdoor.local",
      providerEmail: "user@outdoor.local",
      emailVerified: true,
      lastLoginAt: new Date(),
    },
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
