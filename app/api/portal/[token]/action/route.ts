import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientApprovalSchema } from "@/lib/validations/portal";
import { checkRateLimit } from "@/lib/rate-limiter";

// Helper aman untuk BigInt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jsonResponse = (data: any, status = 200, headers: Record<string, string> = {}) => {
  return new NextResponse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
    {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    },
  );
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const token = resolvedParams.token;

    // Rate Limiting (US-502): Maksimal 5 permintaan approval/revisi per menit per token/IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown-ip";
    const rateLimitKey = `portal-${token}-${ip}`;
    const limitResult = checkRateLimit(rateLimitKey, 5, 60000);

    if (limitResult.limited) {
      return jsonResponse(
        {
          success: false,
          message: `Terlalu banyak permintaan. Silakan tunggu ${limitResult.resetSeconds} detik sebelum mencoba kembali.`,
        },
        429,
        { "Retry-After": limitResult.resetSeconds.toString() },
      );
    }

    const body = await req.json();
    const validationResult = clientApprovalSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi aksi portal gagal",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { action, revisionNote } = validationResult.data;

    // Cari SOW berdasarkan token
    const sow = await prisma.sOW.findUnique({
      where: { magicLinkToken: token },
      include: { deal: true },
    });

    if (!sow) {
      return jsonResponse(
        { success: false, message: "Dokumen SOW tidak ditemukan." },
        404,
      );
    }

    // Validasi masa aktif token
    if (sow.tokenExpiresAt && new Date() > new Date(sow.tokenExpiresAt)) {
      return jsonResponse(
        { success: false, message: "Tautan sudah kedaluwarsa." },
        410,
      );
    }

    if (action === "APPROVE") {
      // Transaksi Database untuk Approval (BR-APP-02 & State Flow)
      const result = await prisma.$transaction(async (tx) => {
        // 1. Update status SOW menjadi APPROVED
        const updatedSow = await tx.sOW.update({
          where: { id: sow.id },
          data: { status: "APPROVED" },
        });

        // 2. Update status Deal induk menjadi CLOSED_WON (memicu Data Freeze & Handoff otomatis)
        const updatedDeal = await tx.deal.update({
          where: { id: sow.dealId },
          data: { stage: "CLOSED_WON" },
        });

        // 3. Otomatis buat record Handoff awal untuk Project Manager (BR-HND-01 & BR-HND-02)
        await tx.handoff.upsert({
          where: { dealId: sow.dealId },
          update: {},
          create: {
            dealId: sow.dealId,
            assignedOperator: "PENDING_ASSIGNMENT", // Default awal sebelum dipilih PM
            briefNotes: "Otomatis digenerate dari SOW Approved.",
          },
        });

        return { updatedSow, updatedDeal };
      });

      return jsonResponse({
        success: true,
        message: "SOW berhasil disetujui. Deal berstatus Closed Won.",
        data: result,
      });
    } else if (action === "REVISE") {
      if (!revisionNote || revisionNote.length < 15) {
        return jsonResponse(
          {
            success: false,
            message:
              "Catatan revisi wajib diisi minimal 15 karakter (BR-APP-03).",
          },
          400,
        );
      }

      // Transaksi Database untuk Request Revision (BR-APP-03)
      const updatedSow = await prisma.$transaction(async (tx) => {
        const sowRevise = await tx.sOW.update({
          where: { id: sow.id },
          data: {
            status: "REVISING",
            magicLinkToken: null, // Tandai token lama usang / obsolete
          },
        });

        return sowRevise;
      });

      return jsonResponse({
        success: true,
        message:
          "Permintaan revisi berhasil dikirim. Tautan lama kini tidak aktif.",
        data: updatedSow,
      });
    }

    return jsonResponse(
      { success: false, message: "Aksi tidak dikenali." },
      400,
    );
  } catch (error) {
    console.error("Error processing portal action:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
