import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateClientSchema } from "@/lib/validations/client";

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

// PUT /api/clients/[id]: Memperbarui data klien
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const validationResult = updateClientSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data klien gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return jsonResponse(
        { success: false, message: "Data klien tidak ditemukan." },
        404,
      );
    }

    const { clientName, companyName, contactEmail, contactPhone, leadSource } =
      validationResult.data;

    // Jika email diubah, pastikan tidak konflik dengan klien lain
    if (contactEmail && contactEmail !== existingClient.contactEmail) {
      const conflict = await prisma.client.findUnique({
        where: { contactEmail },
      });
      if (conflict) {
        return jsonResponse(
          {
            success: false,
            message: `Email "${contactEmail}" sudah digunakan oleh klien lain.`,
          },
          409,
        );
      }
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        ...(clientName ? { clientName } : {}),
        ...(companyName ? { companyName } : {}),
        ...(contactEmail ? { contactEmail } : {}),
        ...(contactPhone !== undefined ? { contactPhone: contactPhone || null } : {}),
        ...(leadSource !== undefined ? { leadSource: leadSource || null } : {}),
      },
      include: {
        _count: {
          select: { deals: true },
        },
      },
    });

    return jsonResponse({
      success: true,
      message: "Data klien berhasil diperbarui.",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return jsonResponse(
      { success: false, message: "Gagal memperbarui data klien." },
      500,
    );
  }
}

// DELETE /api/clients/[id]: Menghapus klien (dengan perlindungan integritas relasi deal)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existingClient = await prisma.client.findUnique({
      where: { id },
      include: {
        _count: {
          select: { deals: true },
        },
      },
    });

    if (!existingClient) {
      return jsonResponse(
        { success: false, message: "Data klien tidak ditemukan." },
        404,
      );
    }

    // Proteksi Integritas Data: Jangan hapus jika masih memiliki Deal terkait
    if (existingClient._count.deals > 0) {
      return jsonResponse(
        {
          success: false,
          message: `Klien "${existingClient.companyName}" tidak dapat dihapus karena masih memiliki ${existingClient._count.deals} prospek / deal aktif yang terhubung. Hapus atau pindahkan deal terkait terlebih dahulu.`,
        },
        400,
      );
    }

    await prisma.client.delete({
      where: { id },
    });

    return jsonResponse({
      success: true,
      message: "Data klien berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return jsonResponse(
      { success: false, message: "Gagal menghapus data klien." },
      500,
    );
  }
}
