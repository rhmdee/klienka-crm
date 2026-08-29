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
  contactPhone: z.string().optional(),
  leadSource: z.string().optional(),
  estimatedBudget: z
    .bigint()
    .or(z.number().transform((val) => BigInt(val)))
    .default(BigInt(0)),
  techStack: z.array(z.string()).default([]),
  userId: z.string().uuid({ message: "User ID penanggung jawab tidak valid." }),
  clientId: z.string().uuid().optional(),
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

export const updateLeadDetailsSchema = z.object({
  title: z.string().min(3, { message: "Judul prospek minimal 3 karakter" }).optional(),
  description: z.string().optional(),
  estimatedBudget: z.number().nonnegative({ message: "Budget tidak boleh bernilai negatif" }).optional(),
  techStack: z.array(z.string()).optional(),
  clientName: z.string().min(2).optional(),
  companyName: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  leadSource: z.string().optional(),
});

export const createActivitySchema = z.object({
  type: z.enum(["EMAIL", "CALL", "MEETING", "NOTE", "STAGE_CHANGE"]),
  title: z.string().min(2, { message: "Judul aktivitas wajib diisi minimal 2 karakter" }),
  description: z.string().min(1, { message: "Deskripsi aktivitas tidak boleh kosong" }),
  actorName: z.string().optional(),
});
