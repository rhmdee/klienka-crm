import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPermission } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonResponse = (data: any, status = 200) => {
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

// POST /api/users/[id]/reset-password: Kirim email reset password via Supabase Auth
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const { id } = await params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return jsonResponse(
        { success: false, message: "Pengguna tidak ditemukan." },
        404,
      );
    }

    // Panggil Supabase Admin untuk generate / kirim recovery link
    const { error: resetError } =
      await supabaseAdmin.auth.resetPasswordForEmail(existingUser.email);

    if (resetError) {
      console.error("Supabase reset password error:", resetError);
      return jsonResponse(
        {
          success: false,
          message:
            resetError.message || "Gagal mengirim email reset password.",
        },
        400,
      );
    }

    return jsonResponse({
      success: true,
      message: `Email instruksi reset password berhasil dikirim ke ${existingUser.email}.`,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return jsonResponse(
      { success: false, message: "Gagal memproses permintaan reset password." },
      500,
    );
  }
}
