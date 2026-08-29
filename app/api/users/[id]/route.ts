import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validations/user";
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

// PUT /api/users/[id]: Update pengguna
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const { id } = await params;
    const body = await req.json();

    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return jsonResponse(
        { success: false, message: "Pengguna tidak ditemukan." },
        404,
      );
    }

    const { name, email, role } = validationResult.data;

    // Jika email diubah, pastikan tidak bentrok dengan user lain
    if (email && email !== existingUser.email) {
      const emailConflict = await prisma.user.findUnique({
        where: { email },
      });
      if (emailConflict) {
        return jsonResponse(
          {
            success: false,
            message: "Email sudah digunakan oleh pengguna lain.",
          },
          409,
        );
      }
    }

    // Jika mengubah role admin, pastikan tidak menghapus admin terakhir
    if (existingUser.role === "ADMINISTRATOR" && role && role !== "ADMINISTRATOR") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMINISTRATOR" },
      });
      if (adminCount <= 1) {
        return jsonResponse(
          {
            success: false,
            message: "Tidak dapat mengubah peran Administrator terakhir.",
          },
          400,
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(role ? { role } : {}),
      },
    });

    return jsonResponse({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui data pengguna." },
      500,
    );
  }
}

// DELETE /api/users/[id]: Hapus pengguna
export async function DELETE(
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
      include: {
        _count: {
          select: { deals: true },
        },
      },
    });

    if (!existingUser) {
      return jsonResponse(
        { success: false, message: "Pengguna tidak ditemukan." },
        404,
      );
    }

    // Cek jika pengguna adalah Administrator terakhir
    if (existingUser.role === "ADMINISTRATOR") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMINISTRATOR" },
      });
      if (adminCount <= 1) {
        return jsonResponse(
          {
            success: false,
            message: "Tidak dapat menghapus Administrator terakhir di sistem.",
          },
          400,
        );
      }
    }

    // Cek jika pengguna masih memiliki deal yang diasosiasikan
    if (existingUser._count.deals > 0) {
      return jsonResponse(
        {
          success: false,
          message: `Pengguna tidak dapat dihapus karena masih bertanggung jawab atas ${existingUser._count.deals} deal/prospek. Alihkan deal ke pengguna lain terlebih dahulu.`,
        },
        400,
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    // Hapus juga akun autentikasi dari Supabase Auth
    try {
      await supabaseAdmin.auth.admin.deleteUser(id);
    } catch (authErr) {
      console.warn("Peringatan: Gagal menghapus user dari Supabase Auth:", authErr);
    }

    return jsonResponse({
      success: true,
      message: "Pengguna berhasil dihapus dari sistem dan autentikasi.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus pengguna." },
      500,
    );
  }
}
