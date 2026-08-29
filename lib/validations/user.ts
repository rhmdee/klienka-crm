import { z } from "zod";

export const roleEnum = z.enum([
  "ADMINISTRATOR",
  "BUSINESS_DEVELOPMENT",
  "PROJECT_MANAGER",
  "OPERATIONAL_TEAM",
]);

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama lengkap minimal 2 karakter." })
    .max(100, { message: "Nama lengkap maksimal 100 karakter." }),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .email({ message: "Format email tidak valid." }),
  role: roleEnum,
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama lengkap minimal 2 karakter." })
    .max(100, { message: "Nama lengkap maksimal 100 karakter." })
    .optional(),
  email: z
    .string()
    .min(1, { message: "Email wajib diisi." })
    .email({ message: "Format email tidak valid." })
    .optional(),
  role: roleEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
