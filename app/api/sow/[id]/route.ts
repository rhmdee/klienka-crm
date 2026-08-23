import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const sowId = resolvedParams.id;

    if (!sowId) {
      return jsonResponse(
        { success: false, message: "ID SOW tidak valid." },
        400,
      );
    }

    // 1. Ambil data SOW beserta Deal induknya untuk memeriksa status
    const sow = await prisma.sOW.findUnique({
      where: { id: sowId },
      include: { deal: true },
    });

    if (!sow) {
      return jsonResponse(
        { success: false, message: "Dokumen SOW tidak ditemukan." },
        404,
      );
    }

    // 2. PENERAPAN SOW IMMUTABLE LOCK (BR-HND-01 & SRD v1.0)
    // Jika deal sudah CLOSED_WON, tolak mutasi API dengan HTTP 403 Forbidden
    if (sow.deal && sow.deal.stage === "CLOSED_WON") {
      return jsonResponse(
        {
          success: false,
          message:
            "SOW telah dikunci karena deal sudah disetujui (SOW Immutable Lock / BR-HND-01).",
        },
        403,
      );
    }

    const body = await req.json();

    // 3. Proses pembaruan SOW jika belum terkunci
    const updatedSow = await prisma.sOW.update({
      where: { id: sowId },
      data: {
        ...(body.marginPercentage !== undefined
          ? { marginPercentage: body.marginPercentage }
          : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
      },
      include: { items: true },
    });

    return jsonResponse({
      success: true,
      message: "Dokumen SOW berhasil diperbarui.",
      data: updatedSow,
    });
  } catch (error) {
    console.error("Error updating SOW with immutable lock check:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
