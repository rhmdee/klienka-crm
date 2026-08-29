import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLeadSchema } from "@/lib/validations/lead";
import { checkPermission } from "@/lib/auth-guard";

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

// GET: Mengambil daftar leads untuk Kanban Board
export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({ success: true, data: deals });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}

// POST: Membuat Lead Baru dengan penanganan Client otomatis (BR-PIP-01)
export async function POST(req: NextRequest) {
  try {
    // Role Guard: Hanya ADMIN dan BD yang boleh membuat Lead
    const auth = await checkPermission(req, [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
    ]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const body = await req.json();

    const validationResult = createLeadSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data gagal",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const {
      clientName,
      companyName,
      contactEmail,
      contactPhone,
      leadSource,
      estimatedBudget,
      techStack,
      userId,
      clientId,
    } = validationResult.data;

    let targetClientId = clientId;

    // Jika clientId tidak disertakan, cari atau buat entitas Client terlebih dahulu
    if (!targetClientId) {
      let client = await prisma.client.findUnique({
        where: { contactEmail },
      });

      if (!client) {
        client = await prisma.client.create({
          data: {
            clientName,
            companyName,
            contactEmail,
            contactPhone,
            leadSource: leadSource || "Website Inquiry",
          },
        });
      }
      targetClientId = client.id;
    }

    let targetUserId = userId;
    if (!targetUserId) {
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        targetUserId = defaultUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            name: "Business Development",
            email: "bd@klienka.com",
            role: "BUSINESS_DEVELOPMENT",
          },
        });
        targetUserId = newUser.id;
      }
    }

    // Buat Deal baru dengan tahap default INQUIRY (BR-PIP-01)
    const newDeal = await prisma.deal.create({
      data: {
        title: `Proyek - ${companyName}`,
        stage: "INQUIRY",
        estimatedBudget,
        techStack,
        userId: targetUserId,
        clientId: targetClientId,
      },
      include: {
        client: true,
        user: { select: { id: true, name: true, role: true } },
      },
    });

    return jsonResponse({ success: true, data: newDeal }, 201);
  } catch (error) {
    console.error("Error creating lead:", error);
    return jsonResponse(
      { success: false, message: "Internal Server Error" },
      500,
    );
  }
}
