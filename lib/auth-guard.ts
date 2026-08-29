import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export type RoleType =
  | "ADMINISTRATOR"
  | "BUSINESS_DEVELOPMENT"
  | "PROJECT_MANAGER"
  | "OPERATIONAL_TEAM";

// Helper Response JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsonResponse = (data: any, status = 200) => {
  return new NextResponse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const forbiddenResponse = (
  message = "Akses ditolak: Anda tidak memiliki izin untuk melakukan tindakan ini.",
) => {
  return jsonResponse(
    {
      success: false,
      message,
    },
    403,
  );
};

/**
 * Server-Side Role Guard
 * Memeriksa peran pengguna dari HTTP Header `x-user-role` (untuk simulasi MVP)
 * atau dari sesi Supabase Auth database yang sedang aktif.
 */
export async function checkPermission(
  req: NextRequest,
  allowedRoles: RoleType[],
): Promise<{ allowed: boolean; role: RoleType; response?: NextResponse }> {
  // 1. Cek dari Custom Header 'x-user-role' (Simulasi RBAC MVP)
  const headerRole = req.headers.get("x-user-role") as RoleType | null;

  if (headerRole) {
    const isAllowed = allowedRoles.includes(headerRole);
    if (!isAllowed) {
      return {
        allowed: false,
        role: headerRole,
        response: forbiddenResponse(
          `Akses ditolak: Peran ${headerRole} tidak diizinkan mengakses resource ini.`,
        ),
      };
    }
    return { allowed: true, role: headerRole };
  }

  // 2. Fallback: Cek dari Sesi Supabase / User Database
  try {
    const user = await getCurrentUser();
    const userRole = (user?.role || "ADMINISTRATOR") as RoleType;

    const isAllowed = allowedRoles.includes(userRole);
    if (!isAllowed) {
      return {
        allowed: false,
        role: userRole,
        response: forbiddenResponse(
          `Akses ditolak: Peran ${userRole} tidak memiliki hak akses yang memadai.`,
        ),
      };
    }

    return { allowed: true, role: userRole };
  } catch {
    // Default fallback to allow for development if no session/header
    return { allowed: true, role: "ADMINISTRATOR" };
  }
}
