import { NextResponse } from "next/server";
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

// GET /api/handoff
// Mengambil seluruh deal berstatus CLOSED_WON beserta data Handoff, Client, SOW, dan User
export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        stage: "CLOSED_WON",
      },
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
      orderBy: { updatedAt: "desc" },
    });

    return jsonResponse({
      success: true,
      data: deals,
    });
  } catch (error) {
    console.error("Error fetching handoff deals list:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
