import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateGeneralParamSchema } from "@/lib/validations/general-param";
import { checkPermission } from "@/lib/auth-guard";

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

// PUT /api/settings/general-params/[id]: Update parameter sistem
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

    const validationResult = updateGeneralParamSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi parameter gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const existingParam = await prisma.generalParam.findUnique({
      where: { id },
    });

    if (!existingParam) {
      return jsonResponse(
        { success: false, message: "Parameter tidak ditemukan." },
        404,
      );
    }

    const { paramKey, paramValue, description } = validationResult.data;

    // Jika paramKey diubah, cek duplikasi
    if (paramKey && paramKey !== existingParam.paramKey) {
      const conflict = await prisma.generalParam.findUnique({
        where: { paramKey },
      });
      if (conflict) {
        return jsonResponse(
          {
            success: false,
            message: `Kunci parameter "${paramKey}" sudah digunakan.`,
          },
          409,
        );
      }
    }

    const updatedParam = await prisma.generalParam.update({
      where: { id },
      data: {
        ...(paramKey ? { paramKey } : {}),
        ...(paramValue ? { paramValue } : {}),
        ...(description !== undefined ? { description: description || null } : {}),
      },
    });

    return jsonResponse({
      success: true,
      message: "Parameter sistem berhasil diperbarui.",
      data: updatedParam,
    });
  } catch (error) {
    console.error("Error updating general param:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui parameter sistem." },
      500,
    );
  }
}

// DELETE /api/settings/general-params/[id]: Hapus parameter sistem
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

    const existingParam = await prisma.generalParam.findUnique({
      where: { id },
    });

    if (!existingParam) {
      return jsonResponse(
        { success: false, message: "Parameter tidak ditemukan." },
        404,
      );
    }

    await prisma.generalParam.delete({
      where: { id },
    });

    return jsonResponse({
      success: true,
      message: "Parameter sistem berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error deleting general param:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus parameter sistem." },
      500,
    );
  }
}
