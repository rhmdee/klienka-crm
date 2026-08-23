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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> | { token: string } },
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const token = resolvedParams.token;

    if (!token) {
      return jsonResponse(
        { success: false, message: "Token Magic Link tidak valid." },
        400,
      );
    }

    // Cari SOW berdasarkan magicLinkToken
    const sow = await prisma.sOW.findUnique({
      where: { magicLinkToken: token },
      include: {
        items: true,
        deal: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!sow) {
      return jsonResponse(
        { success: false, message: "Dokumen SOW atau tautan tidak ditemukan." },
        404,
      );
    }

    // Validasi masa kedaluwarsa token (BR-APP-01: Berlaku 7 hari)
    if (sow.tokenExpiresAt && new Date() > new Date(sow.tokenExpiresAt)) {
      return jsonResponse(
        {
          success: false,
          message: "Tautan Magic Link telah kedaluwarsa (expired).",
        },
        410,
      );
    }

    return jsonResponse({ success: true, data: sow });
  } catch (error) {
    console.error("Error validating Magic Link portal:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
