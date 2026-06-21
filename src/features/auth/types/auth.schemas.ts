// src/features/auth/types/auth.schemas.ts
//
// Zod schemas define what valid input looks like.
// They are used with react-hook-form to validate forms.
//
// BENEFIT: TypeScript types are INFERRED from the schema —
// you don't write the type manually. Zod generates it.
// Example: z.infer<typeof registerSchema> = RegisterFormValues

import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Username maksimal 30 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh huruf, angka, dan underscore",
      ),

    email: z
      .string()
      .email("Format email tidak valid")
      .min(1, "Email wajib diisi"),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[0-9]/, "Password harus mengandung minimal 1 angka"),

    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),

    // At least one role must be selected
    roles: z
      .array(z.enum(["BUYER", "SELLER", "DRIVER"]))
      .min(1, "Pilih minimal satu peran"),
  })
  // .refine checks a CROSS-FIELD rule (password must match confirmPassword)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"], // Which field shows the error
  });

// TypeScript type inferred automatically from the schema
export type RegisterFormValues = z.infer<typeof registerSchema>;

// ── LOGIN SCHEMA ──────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid")
    .min(1, "Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
