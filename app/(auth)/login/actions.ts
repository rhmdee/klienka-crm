"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export async function loginAction(data: LoginFormData) {
  // 1. Validasi input menggunakan skema Zod di sisi server
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Validasi data gagal. Periksa format email dan password." };
  }

  // 2. Inisialisasi Supabase Server Client
  const supabase = await createClient();

  // 3. Proses autentikasi Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  // 4. Redirect ke dashboard internal jika login berhasil
  redirect("/dashboard");
}
