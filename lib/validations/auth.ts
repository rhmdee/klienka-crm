import { z } from "zod";

// Skema validasi login menggunakan Zod
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

// Infer Tipe TypeScript dari Skema Zod
export type LoginFormData = z.infer<typeof loginSchema>;
