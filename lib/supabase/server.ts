import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat Supabase Client khusus lingkungan Server (Server Components / Actions / Route Handlers)
 * Menggunakan paket modern `@supabase/ssr` untuk menangani HTTP-only cookies secara otomatis.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // Error ini wajar diabaikan jika `setAll` dipanggil dari Server Component
            // karena Server Component tidak diperbolehkan secara langsung mengubah cookies.
            // Penyegaran cookie sesi sebenarnya sudah ditangani di Proxy / Middleware.
          }
        },
      },
    },
  );
}
