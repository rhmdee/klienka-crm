import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validasi payload penugasan operator (BR-DAT-01 & BR-DAT-02)
const updateAssignmentSchema = z.object({
  assignedOperator: z
    .string()
    .min(1, { message: "Nama operator operasional wajib diisi." }),
  briefNotes: z.string().optional(),
});

// Helper aman untuk serialisasi BigInt
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

// GET: Mengambil Handoff Brief & Daftar General Parameters untuk pilihan operator
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> | { dealId: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const dealId = resolvedParams.dealId;

    const handoff = await prisma.handoff.findUnique({
      where: { dealId },
      include: {
        deal: {
          include: {
            client: true,
            sows: {
              where: { status: "APPROVED" },
              include: { items: true },
            },
          },
        },
      },
    });

    if (!handoff) {
      return jsonResponse(
        { success: false, message: "Data Handoff tidak ditemukan." },
        404,
      );
    }

    // Ambil daftar parameter sistem untuk opsi pilihan operator operasional
    const operators = await prisma.generalParam.findMany({
      where: { paramKey: { startsWith: "DEFAULT_OPERATOR" } },
    });

    return jsonResponse({
      success: true,
      data: {
        handoff,
        availableOperators: operators.map((op) => op.paramValue),
      },
    });
  } catch (error) {
    console.error("Error fetching handoff brief:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}

// PATCH: Menunjuk operator operasional secara statis (BR-DAT-01 & BR-DAT-02)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> | { dealId: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const dealId = resolvedParams.dealId;

    const body = await req.json();
    const validationResult = updateAssignmentSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi penugasan operator gagal",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { assignedOperator, briefNotes } = validationResult.data;

    // Pastikan record handoff ada dan deal berstatus CLOSED_WON (BR-HND-01)
    const existingHandoff = await prisma.handoff.findUnique({
      where: { dealId },
      include: { deal: true },
    });

    if (!existingHandoff) {
      return jsonResponse(
        { success: false, message: "Record handoff tidak ditemukan." },
        404,
      );
    }

    if (existingHandoff.deal.stage !== "CLOSED_WON") {
      return jsonResponse(
        {
          success: false,
          message:
            "Handoff hanya dapat diubah jika deal sudah berstatus Closed Won.",
        },
        400,
      );
    }

    // Update assignment operator sebagai string murni tanpa Foreign Key constraint
    const updatedHandoff = await prisma.handoff.update({
      where: { dealId },
      data: {
        assignedOperator, // Disimpan murni sebagai string statis
        ...(briefNotes !== undefined ? { briefNotes } : {}),
      },
    });

    return jsonResponse({
      success: true,
      message: "Penugasan operator operasional berhasil diperbarui.",
      data: updatedHandoff,
    });
  } catch (error) {
    console.error("Error updating handoff assignment:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
