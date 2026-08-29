import { z } from "zod";

export const clientSchema = z.object({
  clientName: z
    .string()
    .min(1, { message: "Nama PIC / Klien wajib diisi." })
    .max(100, { message: "Nama klien maksimal 100 karakter." }),
  companyName: z
    .string()
    .min(1, { message: "Nama perusahaan / institusi wajib diisi." })
    .max(150, { message: "Nama perusahaan maksimal 150 karakter." }),
  contactEmail: z
    .string()
    .min(1, { message: "Alamat email wajib diisi." })
    .email({ message: "Format email tidak valid (contoh: kontak@perusahaan.com)." }),
  contactPhone: z
    .string()
    .max(30, { message: "Nomor kontak maksimal 30 karakter." })
    .optional()
    .nullable(),
  leadSource: z
    .string()
    .max(100, { message: "Sumber prospek maksimal 100 karakter." })
    .optional()
    .nullable(),
});

export const updateClientSchema = z.object({
  clientName: z
    .string()
    .min(1, { message: "Nama PIC / Klien wajib diisi." })
    .max(100, { message: "Nama klien maksimal 100 karakter." })
    .optional(),
  companyName: z
    .string()
    .min(1, { message: "Nama perusahaan / institusi wajib diisi." })
    .max(150, { message: "Nama perusahaan maksimal 150 karakter." })
    .optional(),
  contactEmail: z
    .string()
    .min(1, { message: "Alamat email wajib diisi." })
    .email({ message: "Format email tidak valid." })
    .optional(),
  contactPhone: z
    .string()
    .max(30, { message: "Nomor kontak maksimal 30 karakter." })
    .optional()
    .nullable(),
  leadSource: z
    .string()
    .max(100, { message: "Sumber prospek maksimal 100 karakter." })
    .optional()
    .nullable(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
