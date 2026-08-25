import { supabaseAdmin } from "@/lib/supabase/admin";
import { prisma, RoleType } from "@/lib/prisma";

async function initSuperadmin() {
  const email = "uiux.ppu@gmail.com";
  const password = "super.klienka";
  const name = "System Administrator";

  console.log(`Menginisialisasi Superadmin (${email})...`);

  // 1. Buat / Registrasikan User di Supabase Auth
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Otomatis mengonfirmasi email
    });

  if (authError) {
    if (
      authError.message.includes("already registered") ||
      authError.message.includes("already exists")
    ) {
      console.log(
        "User sudah terdaftar di Supabase Auth. Melanjutkan sinkronisasi Prisma...",
      );
    } else {
      console.error("Gagal membuat user di Supabase Auth:", authError.message);
      return;
    }
  }

  // 2. Dapatkan User ID dari Supabase Auth
  let userId = authData?.user?.id;

  if (!userId) {
    // Jika user sudah ada sebelumnya, ambil ID berdasarkan email
    const { data: usersData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error("Gagal mengambil daftar user Supabase:", listError.message);
      return;
    }
    userId = usersData.users.find((u) => u.email === email)?.id;
  }

  if (!userId) {
    throw new Error("Gagal mendapatkan User ID dari Supabase Auth.");
  }

  // 3. Sinkronisasi Data Profil ke Tabel User Prisma
  const userPrisma = await prisma.user.upsert({
    where: { email },
    update: {
      id: userId,
      role: RoleType.ADMINISTRATOR,
      name,
    },
    create: {
      id: userId, // Gunakan UUID dari Supabase Auth sebagai Primary Key di Prisma
      email,
      name,
      role: RoleType.ADMINISTRATOR,
    },
  });

  console.log("✅ Superadmin berhasil disinkronkan ke pangkalan data Prisma!");
  console.log("Detail User:", {
    id: userPrisma.id,
    email: userPrisma.email,
    role: userPrisma.role,
  });
}

initSuperadmin()
  .catch((err) => {
    console.error("Error saat inisialisasi Superadmin:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
