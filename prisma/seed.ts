import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { env } from "../src/config/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@outdoor.local" },
    update: {
      role: "admin",
      isActive: true,
    },
    create: {
      email: "admin@outdoor.local",
      displayName: "Platform Admin",
      role: "admin",
      isActive: true,
    },
  });

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

  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@outdoor.local" },
    update: {
      role: "owner",
      isActive: true,
    },
    create: {
      email: "owner@outdoor.local",
      displayName: "Venue Owner",
      role: "owner",
      isActive: true,
    },
  });

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
      userId: ownerUser.id,
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
      role: "user",
      isActive: true,
    },
    create: {
      email: "user@outdoor.local",
      displayName: "Sample User",
      role: "user",
      isActive: true,
    },
  });

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
