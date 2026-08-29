import { prisma } from "@/lib/prisma";

/**
 * Mengambil satu nilai parameter sistem berdasarkan kunci (paramKey).
 * Mengembalikan defaultValue jika parameter tidak ditemukan.
 */
export async function getGeneralParam(
  key: string,
  defaultValue = "",
): Promise<string> {
  try {
    const param = await prisma.generalParam.findUnique({
      where: { paramKey: key },
    });
    return param?.paramValue ?? defaultValue;
  } catch (error) {
    console.error(`Error reading general param "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Mengambil parameter angka (misal: MIN_PROFIT_MARGIN, RATE_*) dalam bentuk number.
 */
export async function getNumericGeneralParam(
  key: string,
  defaultValue = 0,
): Promise<number> {
  const raw = await getGeneralParam(key);
  if (!raw) return defaultValue;
  const num = Number(raw);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Mengambil daftar parameter sistem berdasarkan prefix (misal: "OPERATOR", "DEFAULT_OPERATOR", "RATE_").
 */
export async function getGeneralParamsByPrefix(
  prefix: string,
): Promise<Array<{ paramKey: string; paramValue: string; description: string | null }>> {
  try {
    return await prisma.generalParam.findMany({
      where: { paramKey: { startsWith: prefix } },
      orderBy: { paramKey: "asc" },
    });
  } catch (error) {
    console.error(`Error fetching general params with prefix "${prefix}":`, error);
    return [];
  }
}

/**
 * Mengambil seluruh daftar nama operator operasional yang aktif untuk penugasan Handoff.
 */
export async function getAvailableOperators(): Promise<string[]> {
  try {
    const params = await prisma.generalParam.findMany({
      where: {
        OR: [
          { paramKey: { startsWith: "DEFAULT_OPERATOR" } },
          { paramKey: { startsWith: "OPERATOR" } },
        ],
      },
      orderBy: { paramKey: "asc" },
    });
    return params.map((p) => p.paramValue);
  } catch (error) {
    console.error("Error fetching available operators:", error);
    return [];
  }
}
