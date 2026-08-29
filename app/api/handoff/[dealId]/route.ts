import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableOperators } from "@/lib/params";
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

    if (!dealId) {
      return jsonResponse(
        { success: false, message: "Parameter dealId wajib disertakan." },
        400,
      );
    }

    // Ambil data Deal terlebih dahulu
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        handoff: true,
        sows: {
          where: { status: "APPROVED" },
          orderBy: { version: "desc" },
          include: { items: true },
        },
      },
    });

    if (!deal) {
      return jsonResponse(
        { success: false, message: "Data Deal / Prospek tidak ditemukan." },
        404,
      );
    }

    // Jika deal CLOSED_WON tapi belum ada record handoff, otomatis create (upsert)
    let handoff = deal.handoff;
    if (!handoff && deal.stage === "CLOSED_WON") {
      handoff = await prisma.handoff.create({
        data: {
          dealId: deal.id,
          assignedOperator: "PENDING_ASSIGNMENT",
          briefNotes: "Otomatis dibuat saat membuka dokumen Handoff Brief.",
        },
      });
    }

    // Ambil daftar nama operator operasional dari General Parameters
    const availableOperators = await getAvailableOperators();

    return jsonResponse({
      success: true,
      data: {
        deal,
        handoff,
        availableOperators,
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

    // Pastikan record deal ada dan berstatus CLOSED_WON (BR-HND-01)
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return jsonResponse(
        { success: false, message: "Data Deal tidak ditemukan." },
        404,
      );
    }

    if (deal.stage !== "CLOSED_WON") {
      return jsonResponse(
        {
          success: false,
          message:
            "Handoff hanya dapat diubah jika deal sudah berstatus Closed Won.",
        },
        400,
      );
    }

    // Upsert assignment operator sebagai string murni tanpa Foreign Key constraint (BR-DAT-01 & BR-DAT-02)
    const updatedHandoff = await prisma.handoff.upsert({
      where: { dealId },
      update: {
        assignedOperator, // Disimpan murni sebagai string statis
        ...(briefNotes !== undefined ? { briefNotes } : {}),
      },
      create: {
        dealId,
        assignedOperator,
        briefNotes: briefNotes || "",
      },
    });

    // Catat Activity
    await prisma.dealActivity.create({
      data: {
        dealId,
        type: "NOTE",
        title: "Penugasan Operator Handoff",
        description: `Penanggung jawab teknis ditugaskan kepada: ${assignedOperator}.`,
        actorName: "Project Manager",
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
