import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateLeadDetailsSchema } from "@/lib/validations/lead";

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

// GET: Mengambil detail satu deal lengkap dengan client, user, sows, handoff, dan activities
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return jsonResponse(
        { success: false, message: "ID Prospek tidak valid." },
        400,
      );
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        sows: { orderBy: { createdAt: "desc" } },
        handoff: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!deal) {
      return jsonResponse(
        { success: false, message: "Prospek (Deal) tidak ditemukan." },
        404,
      );
    }

    return jsonResponse({ success: true, data: deal });
  } catch (error) {
    console.error("Error fetching deal detail:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}

// PATCH: Mengedit informasi umum deal & kontak klien
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return jsonResponse(
        { success: false, message: "ID Prospek tidak valid." },
        400,
      );
    }

    const body = await req.json();
    const validation = updateLeadDetailsSchema.safeParse(body);

    if (!validation.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data gagal",
          errors: validation.error.format(),
        },
        400,
      );
    }

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!existingDeal) {
      return jsonResponse(
        { success: false, message: "Prospek tidak ditemukan." },
        404,
      );
    }

    const {
      title,
      description,
      estimatedBudget,
      techStack,
      clientName,
      companyName,
      contactEmail,
      contactPhone,
      leadSource,
    } = validation.data;

    // Update Client jika ada data klien yang diubah
    if (
      clientName ||
      companyName ||
      contactEmail ||
      contactPhone !== undefined ||
      leadSource !== undefined
    ) {
      await prisma.client.update({
        where: { id: existingDeal.clientId },
        data: {
          ...(clientName ? { clientName } : {}),
          ...(companyName ? { companyName } : {}),
          ...(contactEmail ? { contactEmail } : {}),
          ...(contactPhone !== undefined ? { contactPhone } : {}),
          ...(leadSource !== undefined ? { leadSource } : {}),
        },
      });
    }

    // Update Deal
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(estimatedBudget !== undefined
          ? { estimatedBudget: BigInt(estimatedBudget) }
          : {}),
        ...(techStack ? { techStack } : {}),
      },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        sows: true,
        handoff: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });

    return jsonResponse({
      success: true,
      message: "Data prospek berhasil diperbarui.",
      data: updatedDeal,
    });
  } catch (error) {
    console.error("Error updating deal details:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
