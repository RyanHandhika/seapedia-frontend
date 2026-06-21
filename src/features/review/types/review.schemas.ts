// src/features/review/types/review.schemas.ts
import { z } from "zod";

export const reviewSchema = z.object({
  reviewerName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(50, "Nama terlalu panjang"),
  rating: z.number({ required_error: "Pilih rating bintang" }).min(1).max(5),
  comment: z
    .string()
    .min(10, "Komentar minimal 10 karakter")
    .max(500, "Komentar terlalu panjang"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
