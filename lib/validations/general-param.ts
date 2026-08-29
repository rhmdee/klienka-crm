import { z } from "zod";

export const generalParamSchema = z.object({
  paramKey: z
    .string()
    .min(1, { message: "Kunci parameter (Key) wajib diisi." })
    .max(100, { message: "Kunci parameter maksimal 100 karakter." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Kunci parameter hanya boleh berisi huruf, angka, dan underscore (_).",
    }),
  paramValue: z
    .string()
    .min(1, { message: "Nilai parameter (Value) wajib diisi." })
    .max(1000, { message: "Nilai parameter maksimal 1000 karakter." }),
  description: z
    .string()
    .max(500, { message: "Deskripsi maksimal 500 karakter." })
    .optional()
    .nullable(),
});

export const updateGeneralParamSchema = z.object({
  paramKey: z
    .string()
    .min(1, { message: "Kunci parameter (Key) wajib diisi." })
    .max(100, { message: "Kunci parameter maksimal 100 karakter." })
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "Kunci parameter hanya boleh berisi huruf, angka, dan underscore (_).",
    })
    .optional(),
  paramValue: z
    .string()
    .min(1, { message: "Nilai parameter (Value) wajib diisi." })
    .max(1000, { message: "Nilai parameter maksimal 1000 karakter." })
    .optional(),
  description: z
    .string()
    .max(500, { message: "Deskripsi maksimal 500 karakter." })
    .optional()
    .nullable(),
});

export type GeneralParamFormData = z.infer<typeof generalParamSchema>;
