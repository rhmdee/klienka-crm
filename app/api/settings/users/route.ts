import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validations/user";

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

// GET /api/settings/users: Ambil seluruh daftar pengguna
export async function GET() {
  try {
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

// POST /api/settings/users: Tambah pengguna baru
export async function POST(req: NextRequest) {
  try {
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

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return jsonResponse(
        {
          success: false,
          message: "Email sudah digunakan oleh pengguna lain.",
        },
        409,
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    });

    return jsonResponse(
      {
        success: true,
        message: "Pengguna berhasil ditambahkan.",
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
