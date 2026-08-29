import { prisma, RoleType } from "@/lib/prisma";

async function main() {
  console.log("Seeding master data & general parameters...");

  // 1. Seed Operator Handoff Defaults
  const initialParams = [
    {
      paramKey: "DEFAULT_OPERATOR_1",
      paramValue: "Daryadi (Lead Developer)",
      description: "Operator teknis default untuk serah terima proyek",
    },
    {
      paramKey: "DEFAULT_OPERATOR_2",
      paramValue: "Rahul (Frontend Engineer)",
      description: "Operator spesialis antarmuka dan web frontend",
    },
    {
      paramKey: "DEFAULT_OPERATOR_3",
      paramValue: "Siti Aminah (Mobile Specialist)",
      description: "Operator spesialis mobile application (iOS & Android)",
    },
    {
      paramKey: "DEFAULT_OPERATOR_4",
      paramValue: "Budi Santoso (DevOps & Backend Lead)",
      description: "Operator spesialis cloud infrastructure & backend API",
    },
    // 2. Seed Standard SOW Rate Cards (IDR / Man-Day)
    {
      paramKey: "RATE_UI_UX",
      paramValue: "1500000",
      description: "Standar rate harian (IDR/man-day) untuk UI/UX Designer",
    },
    {
      paramKey: "RATE_FRONTEND",
      paramValue: "1800000",
      description: "Standar rate harian (IDR/man-day) untuk Frontend Engineer",
    },
    {
      paramKey: "RATE_BACKEND",
      paramValue: "2000000",
      description: "Standar rate harian (IDR/man-day) untuk Backend Engineer",
    },
    {
      paramKey: "RATE_QA",
      paramValue: "1200000",
      description: "Standar rate harian (IDR/man-day) untuk QA Engineer",
    },
    {
      paramKey: "RATE_PROJECT_MANAGER",
      paramValue: "2200000",
      description: "Standar rate harian (IDR/man-day) untuk Project Manager",
    },
    // 3. Seed SOW Margins & Company Meta
    {
      paramKey: "MIN_PROFIT_MARGIN",
      paramValue: "20",
      description: "Batas minimum margin keuntungan standar proposal SOW (%)",
    },
    {
      paramKey: "COMPANY_NAME",
      paramValue: "Klienka Digital Solusindo",
      description: "Nama resmi entitas software house pada proposal & portal",
    },
    {
      paramKey: "COMPANY_SUPPORT_EMAIL",
      paramValue: "support@klienka.com",
      description: "Email resmi layanan bantuan klien pada Client Portal",
    },
  ];

  for (const p of initialParams) {
    await prisma.generalParam.upsert({
      where: { paramKey: p.paramKey },
      update: {
        paramValue: p.paramValue,
        description: p.description,
      },
      create: p,
    });
  }

  // 4. Seed Admin User
  await prisma.user.upsert({
    where: { email: "admin@softwarehouse.com" },
    update: {},
    create: {
      email: "admin@softwarehouse.com",
      name: "System Administrator",
      role: RoleType.ADMINISTRATOR,
    },
  });

  console.log("Seeding master data & general parameters berhasil dieksekusi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
