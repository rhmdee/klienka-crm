import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getNumericGeneralParam } from "@/lib/params";
import { createSowSchema } from "@/lib/validations/sow";
import { randomUUID } from "crypto";
import { checkPermission, forbiddenResponse } from "@/lib/auth-guard";

// Helper untuk serialisasi BigInt
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

export async function POST(req: NextRequest) {
  try {
    // 1. Role Guard: Hanya ADMIN dan BD yang boleh membuat atau mengubah SOW
    const auth = await checkPermission(req, [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
    ]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const body = await req.json();

    const validationResult = createSowSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data SOW gagal",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { dealId, marginPercentage, items } = validationResult.data;

    // Pastikan Deal ada
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { sows: true },
    });
    if (!deal) {
      return jsonResponse(
        { success: false, message: "Deal tidak ditemukan" },
        404,
      );
    }

    // 2. SOW Lock Guard: Jika deal CLOSED_WON atau ada SOW APPROVED, hanya ADMIN yang boleh override
    const isLocked =
      deal.stage === "CLOSED_WON" ||
      deal.sows.some((s) => s.status === "APPROVED");

    if (isLocked && auth.role !== "ADMINISTRATOR") {
      return forbiddenResponse(
        "Dokumen SOW ini telah disetujui (Closed Won) dan terkunci. Hanya Administrator yang memiliki hak force majeure override.",
      );
    }

    // Hitung COGS (Cost of Goods Sold) dari total item (Man-Days * Daily Rate)
    let totalCogs = BigInt(0);
    const formattedItems = items.map((item) => {
      const subtotal = BigInt(item.manDays) * BigInt(item.dailyRate);
      totalCogs += subtotal;
      return {
        roleName: item.roleName,
        manDays: item.manDays,
        dailyRate: BigInt(item.dailyRate),
        subtotal,
      };
    });

    // Terapkan Margin Profit minimum dinamis dari General Parameters (default 20% / BR-SOW-02)
    const minMargin = await getNumericGeneralParam("MIN_PROFIT_MARGIN", 20);
    if (marginPercentage < minMargin) {
      return jsonResponse(
        {
          success: false,
          message: `Margin keuntungan tidak boleh kurang dari batas minimum sistem (${minMargin}%).`,
        },
        400,
      );
    }

    const profitMultiplier = 1 + marginPercentage / 100;
    // Konversi sederhana untuk BigInt kalkulasi margin
    const totalCostWithMargin = BigInt(
      Math.round(Number(totalCogs) * profitMultiplier),
    );

    // Generate Magic Link token untuk klien (berlaku 7 hari / BR-APP-01)
    const magicLinkToken = randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Simpan SOW dan item-itemnya menggunakan Prisma Transaction
    const newSow = await prisma.$transaction(async (tx) => {
      const sow = await tx.sOW.create({
        data: {
          dealId,
          marginPercentage,
          totalCost: totalCostWithMargin,
          magicLinkToken,
          tokenExpiresAt,
          status: "SENT", // Otomatis berstatus SENT setelah di-generate (State Flow v1.0)
          items: {
            create: formattedItems,
          },
        },
        include: { items: true },
      });

      // Update status Deal menjadi NEGOTIATION (BR-PIP-03)
      await tx.deal.update({
        where: { id: dealId },
        data: { stage: "NEGOTIATION" },
      });

      return sow;
    });

    return jsonResponse({ success: true, data: newSow }, 201);
  } catch (error) {
    console.error("Error creating SOW:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
