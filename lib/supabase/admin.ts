import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Admin Client dengan Service Role Key untuk bypass RLS
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
