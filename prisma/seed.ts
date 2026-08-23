import { prisma, RoleType } from "@/lib/prisma";

async function main() {
  // Seed General Parameters (Termasuk operator operasional default)
  await prisma.generalParam.upsert({
    where: { paramKey: "DEFAULT_OPERATOR_1" },
    update: {},
    create: {
      paramKey: "DEFAULT_OPERATOR_1",
      paramValue: "Daryadi (Lead Developer)",
      description: "Operator default untuk penugasan handoff",
    },
  });

  await prisma.generalParam.upsert({
    where: { paramKey: "DEFAULT_OPERATOR_2" },
    update: {},
    create: {
      paramKey: "DEFAULT_OPERATOR_2",
      paramValue: "Rahul (Frontend Engineer)",
      description: "Operator frontend untuk penugasan handoff",
    },
  });

  // Seed Admin User
  await prisma.user.upsert({
    where: { email: "admin@softwarehouse.com" },
    update: {},
    create: {
      email: "admin@softwarehouse.com",
      name: "System Administrator",
      role: RoleType.ADMINISTRATOR,
    },
  });

  console.log("Seeding master data berhasil dieksekusi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
