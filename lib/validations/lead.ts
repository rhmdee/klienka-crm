import { z } from "zod";

export const createLeadSchema = z.object({
  clientName: z
    .string()
    .min(3, {
      message: "Nama klien tidak boleh kosong dan minimal 3 karakter.",
    })
    .max(100),
  companyName: z
    .string()
    .min(2, { message: "Nama perusahaan wajib diisi minimal 2 karakter." }),
  contactEmail: z.string().email({ message: "Format email tidak valid." }),
  estimatedBudget: z
    .bigint()
    .or(z.number().transform((val) => BigInt(val)))
    .default(BigInt(0)),
  techStack: z.array(z.string()).default([]),
  userId: z.string().uuid({ message: "User ID penanggung jawab tidak valid." }),
  clientId: z.string().uuid().optional(), // Opsional jika ingin langsung assign client yang sudah ada
  // clientId: z.string().uuid({ message: "Client ID tidak valid." }),
});

export const updateLeadStageSchema = z.object({
  stage: z.enum([
    "INQUIRY",
    "DISCOVERY_CALL",
    "SOW_ESTIMATION",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  estimatedBudget: z.number().optional(),
  techStack: z.array(z.string()).optional(),
  lossReason: z.string().optional(),
});
