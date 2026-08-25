import { type NextRequest } from "next/server";
import { updateSessionProxy } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSessionProxy(request);
}

// Ekspor matcher untuk menyaring rute yang diproses oleh Proxy Interceptor
export const config = {
  matcher: [
    /*
     * Menerapkan proxy ke semua rute KECUALI:
     * - _next/static & _next/image (file statis/gambar)
     * - favicon.ico & aset publik (png, jpg, svg, dll.)
     * - Portal Klien Eksternal (/portal/**)
     */
    "/((?!_next/static|_next/image|favicon.ico|portal/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
