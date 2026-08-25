import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Mengambil data pengguna yang sedang aktif/login dari sesi Supabase Auth
 * beserta detail profil dan role dari basis data Prisma.
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  // 1. Ambil data user dari sesi Supabase Auth
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // 2. Ambil data profil relasional (Role, Nama, Email) dari tabel User Prisma
  const userProfile = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!userProfile) {
    return null;
  }

  return userProfile;
}
