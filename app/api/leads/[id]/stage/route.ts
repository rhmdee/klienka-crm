import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateLeadStageSchema } from "@/lib/validations/lead";
import { checkPermission } from "@/lib/auth-guard";

// Helper aman untuk BigInt
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    // Role Guard: Hanya ADMIN dan BD yang boleh memindahkan stage lead
    const auth = await checkPermission(req, [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
    ]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    // Tangani params dengan aman (mendukung Next.js App Router terbaru)
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Deal tidak ditemukan pada URL" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const validationResult = updateLeadStageSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validasi input stage gagal",
          errors: validationResult.error.format(),
        },
        { status: 400 },
      );
    }

    const { stage, estimatedBudget, techStack, lossReason } =
      validationResult.data;

    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { success: false, message: "Lead / Deal tidak ditemukan" },
        { status: 404 },
      );
    }

    if (stage === "DISCOVERY_CALL") {
      const targetBudget =
        estimatedBudget !== undefined
          ? BigInt(estimatedBudget)
          : existingDeal.estimatedBudget;
      const targetTechStack =
        techStack !== undefined ? techStack : existingDeal.techStack;

      if (
        targetBudget <= BigInt(0) ||
        !targetTechStack ||
        targetTechStack.length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Estimasi budget (>0) dan minimal satu tech stack wajib diisi sebelum lanjut ke Discovery (BR-PIP-02).",
          },
          { status: 400 },
        );
      }
    }

    let updatedDeal;

    if (stage === "CLOSED_WON") {
      const result = await prisma.$transaction(async (tx) => {
        const dealRes = await tx.deal.update({
          where: { id },
          data: {
            stage,
            ...(estimatedBudget !== undefined
              ? { estimatedBudget: BigInt(estimatedBudget) }
              : {}),
            ...(techStack !== undefined ? { techStack } : {}),
            ...(lossReason !== undefined ? { lossReason } : {}),
          },
        });

        // Ensure latest SOW is marked approved
        const latestSow = await tx.sOW.findFirst({
          where: { dealId: id },
          orderBy: { version: "desc" },
        });

        if (latestSow && latestSow.status !== "APPROVED") {
          await tx.sOW.update({
            where: { id: latestSow.id },
            data: { status: "APPROVED" },
          });
        }

        // Auto-create / upsert Handoff record
        await tx.handoff.upsert({
          where: { dealId: id },
          update: {},
          create: {
            dealId: id,
            assignedOperator: "PENDING_ASSIGNMENT",
            briefNotes: "Otomatis digenerate saat deal ditandai Closed Won.",
          },
        });

        return dealRes;
      });
      updatedDeal = result;
    } else {
      updatedDeal = await prisma.deal.update({
        where: { id },
        data: {
          stage,
          ...(estimatedBudget !== undefined
            ? { estimatedBudget: BigInt(estimatedBudget) }
            : {}),
          ...(techStack !== undefined ? { techStack } : {}),
          ...(lossReason !== undefined ? { lossReason } : {}),
        },
      });
    }

    // Serialisasi BigInt otomatis untuk JSON response
    return new NextResponse(
      JSON.stringify({ success: true, data: updatedDeal }, (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("DETAILED PATCH ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
