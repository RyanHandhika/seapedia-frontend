// src/features/auth/types/upgrade.schemas.ts
//
// Validation for the role-upgrade forms ("Become a Seller" / "Become
// a Driver"). Kept separate from auth.schemas.ts because these run
// AFTER login, on an already-authenticated user — different lifecycle,
// different form, different file.

import { z } from "zod";

// ── BECOME A SELLER ───────────────────────────────────────
// Minimum viable store registration. Store name uniqueness is
// validated server-side (can't reliably check uniqueness on the
// client) — the mutation surfaces that error inline if it occurs.
export const becomeSellerSchema = z.object({
  storeName: z
    .string()
    .min(3, "Nama toko minimal 3 karakter")
    .max(50, "Nama toko maksimal 50 karakter")
    .regex(
      /^[a-zA-Z0-9\s_-]+$/,
      "Nama toko hanya boleh huruf, angka, spasi, - dan _",
    ),
});

export type BecomeSellerFormValues = z.infer<typeof becomeSellerSchema>;

// ── BECOME A DRIVER ───────────────────────────────────────
export const becomeDriverSchema = z.object({
  vehicleType: z.enum(["MOTOR", "MOBIL"], {
    message: "Pilih jenis kendaraan",
  }),
  licenseNumber: z
    .string()
    .min(8, "Nomor SIM minimal 8 karakter")
    .max(20, "Nomor SIM maksimal 20 karakter"),
  phoneNumber: z
    .string()
    .regex(/^08[0-9]{8,12}$/, "Nomor HP tidak valid (contoh: 081234567890)"),
});

export type BecomeDriverFormValues = z.infer<typeof becomeDriverSchema>;
