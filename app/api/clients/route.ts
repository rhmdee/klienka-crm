import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validations/client";
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

// GET /api/clients: Mengambil seluruh daftar klien beserta total deal terkait
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonResponse({
      success: true,
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients list:", error);
    return jsonResponse(
      { success: false, message: "Gagal memuat data direktori klien." },
      500,
    );
  }
}

// POST /api/clients: Menambahkan klien baru ke database
export async function POST(req: NextRequest) {
  try {
    // Role Guard: Hanya ADMIN dan BD yang boleh menambah klien
    const auth = await checkPermission(req, [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
    ]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const body = await req.json();

    const validationResult = clientSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi data klien gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { clientName, companyName, contactEmail, contactPhone, leadSource } =
      validationResult.data;

    // Cek duplikasi email kontak
    const existingClient = await prisma.client.findUnique({
      where: { contactEmail },
    });

    if (existingClient) {
      return jsonResponse(
        {
          success: false,
          message: `Email kontak "${contactEmail}" sudah terdaftar atas nama ${existingClient.clientName} (${existingClient.companyName}).`,
        },
        409,
      );
    }

    const newClient = await prisma.client.create({
      data: {
        clientName,
        companyName,
        contactEmail,
        contactPhone: contactPhone || null,
        leadSource: leadSource || null,
      },
      include: {
        _count: {
          select: { deals: true },
        },
      },
    });

    return jsonResponse(
      {
        success: true,
        message: "Data klien berhasil ditambahkan.",
        data: newClient,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return jsonResponse(
      { success: false, message: "Gagal menyimpan data klien baru." },
      500,
    );
  }
}
