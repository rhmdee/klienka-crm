"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const supabase = await createClient();

  // 1. Hapus cookie sesi dari Supabase Auth
  await supabase.auth.signOut();

  // 2. Redirect ke halaman login
  redirect("/login");
}
