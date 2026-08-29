import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations/user";
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

// GET /api/users: Ambil seluruh daftar pengguna
export async function GET(req: NextRequest) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return jsonResponse(
      { success: false, message: "Gagal memuat data pengguna." },
      500,
    );
  }
}

// POST /api/users: Tambah pengguna baru & kirim undangan email Supabase Auth
export async function POST(req: NextRequest) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const body = await req.json();

    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data pengguna gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { name, email, role } = validationResult.data;

    // Cek apakah email sudah terdaftar di Prisma DB
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return jsonResponse(
        {
          success: false,
          message: "Email sudah digunakan oleh pengguna lain di database.",
        },
        409,
      );
    }

    // Dapatkan origin URL request (otomatis mendeteksi domain Vercel / localhost)
    const origin =
      req.headers.get("origin") ||
      (req.headers.get("x-forwarded-host")
        ? `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get("x-forwarded-host")}`
        : req.nextUrl.origin);

    // 1. Kirim Email Undangan ke Supabase Auth dengan dynamic redirectTo
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/dashboard`,
        data: {
          name,
          role,
        },
      });

    if (authError || !authData.user) {
      console.error("Supabase Auth invite error:", authError);
      return jsonResponse(
        {
          success: false,
          message:
            authError?.message ||
            "Gagal mengirim undangan pendaftaran via Supabase Auth.",
        },
        400,
      );
    }

    // 2. Simpan ke database lokal dengan UID yang sama dari Supabase Auth
    const newUser = await prisma.user.create({
      data: {
        id: authData.user.id,
        name,
        email,
        role,
      },
    });

    return jsonResponse(
      {
        success: true,
        message:
          "Pengguna berhasil ditambahkan dan email undangan login telah dikirim.",
        data: newUser,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return jsonResponse(
      { success: false, message: "Gagal menambahkan pengguna baru." },
      500,
    );
  }
}
