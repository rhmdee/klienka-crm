import { z } from "zod";

export const sowItemSchema = z.object({
  roleName: z.string().min(2, { message: "Nama peran teknis wajib diisi." }),
  manDays: z
    .number()
    .int()
    .min(1, { message: "Jumlah Man-Days minimal 1 hari." }),
  dailyRate: z.bigint().or(z.number().transform((val) => BigInt(val))),
});

export const createSowSchema = z.object({
  dealId: z.string().uuid({ message: "Deal ID tidak valid." }),
  marginPercentage: z
    .number()
    .min(20, { message: "Margin profit minimal adalah 20% (BR-SOW-02)." })
    .default(20.0),
  items: z
    .array(sowItemSchema)
    .min(1, { message: "Minimal harus ada 1 item peran teknis dalam SOW." }),
});
