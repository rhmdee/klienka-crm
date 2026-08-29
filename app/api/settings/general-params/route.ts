import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generalParamSchema } from "@/lib/validations/general-param";
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

// GET /api/settings/general-params: Ambil seluruh daftar parameter sistem
export async function GET(req: NextRequest) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const params = await prisma.generalParam.findMany({
      orderBy: { paramKey: "asc" },
    });

    return jsonResponse({
      success: true,
      data: params,
    });
  } catch (error) {
    console.error("Error fetching general params:", error);
    return jsonResponse(
      { success: false, message: "Gagal memuat data parameter sistem." },
      500,
    );
  }
}

// POST /api/settings/general-params: Tambah parameter sistem baru
export async function POST(req: NextRequest) {
  try {
    const auth = await checkPermission(req, ["ADMINISTRATOR"]);
    if (!auth.allowed && auth.response) {
      return auth.response;
    }

    const body = await req.json();

    const validationResult = generalParamSchema.safeParse(body);
    if (!validationResult.success) {
      return jsonResponse(
        {
          success: false,
          message: "Validasi parameter gagal.",
          errors: validationResult.error.format(),
        },
        400,
      );
    }

    const { paramKey, paramValue, description } = validationResult.data;

    // Cek apakah paramKey sudah terdaftar
    const existingParam = await prisma.generalParam.findUnique({
      where: { paramKey },
    });

    if (existingParam) {
      return jsonResponse(
        {
          success: false,
          message: `Kunci parameter "${paramKey}" sudah ada. Gunakan kunci yang berbeda.`,
        },
        409,
      );
    }

    const newParam = await prisma.generalParam.create({
      data: {
        paramKey,
        paramValue,
        description: description || null,
      },
    });

    return jsonResponse(
      {
        success: true,
        message: "Parameter sistem berhasil ditambahkan.",
        data: newParam,
      },
      201,
    );
  } catch (error) {
    console.error("Error creating general param:", error);
    return jsonResponse(
      { success: false, message: "Gagal menambahkan parameter sistem baru." },
      500,
    );
  }
}
