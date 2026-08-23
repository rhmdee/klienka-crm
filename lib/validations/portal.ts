import { z } from "zod";

export const clientApprovalSchema = z.object({
  action: z.enum(["APPROVE", "REVISE"]),
  revisionNote: z
    .string()
    .min(15, {
      message:
        "Catatan revisi terlalu singkat, mohon jelaskan bagian yang perlu disesuaikan (minimal 15 karakter).",
    })
    .max(1000)
    .optional(),
});
