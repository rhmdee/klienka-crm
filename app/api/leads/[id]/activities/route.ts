import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createActivitySchema } from "@/lib/validations/lead";

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

// GET: Mengambil riwayat aktivitas untuk sebuah deal
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

    const activities = await prisma.dealActivity.findMany({
      where: { dealId: id },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}

// POST: Menambahkan log aktivitas / catatan baru untuk sebuah deal
export async function POST(
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
    const validation = createActivitySchema.safeParse(body);

    if (!validation.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data aktivitas gagal",
          errors: validation.error.format(),
        },
        400,
      );
    }

    const deal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      return jsonResponse(
        { success: false, message: "Prospek tidak ditemukan." },
        404,
      );
    }

    const { type, title, description, actorName } = validation.data;

    const newActivity = await prisma.dealActivity.create({
      data: {
        dealId: id,
        type,
        title,
        description,
        actorName: actorName || "Tim BD",
      },
    });

    return jsonResponse(
      {
        success: true,
        message: "Aktivitas berhasil dicatat.",
        data: newActivity,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
