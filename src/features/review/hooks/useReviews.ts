// src/features/review/hooks/useReviews.ts
//
// Stores reviews in localStorage for Level 1.
// When the backend review API is ready, ONLY this file changes —
// all components (ReviewList, ReviewCard) stay exactly the same.

import { useState, useCallback } from "react";
import type { AppReview, CreateReviewPayload } from "../types/review.types";

const STORAGE_KEY = "seapedia-reviews";

// Seed data so the page never looks empty on first visit
const SEED_REVIEWS: AppReview[] = [
  {
    id: "seed-1",
    reviewerName: "Budi Santoso",
    rating: 5,
    comment:
      "Platform yang sangat mudah digunakan! Pengiriman cepat dan produknya original. Highly recommended!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seed-2",
    reviewerName: "Sari Dewi",
    rating: 4,
    comment:
      "Belanja di SEAPEDIA menyenangkan. Banyak pilihan produk dari berbagai penjual. Harga juga kompetitif.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "seed-3",
    reviewerName: "Andi Pratama",
    rating: 5,
    comment:
      "Antarmuka aplikasinya bersih dan intuitif. Proses checkout mudah. Penjualnya juga responsif!",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function readFromStorage(): AppReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit — seed with demo reviews
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    return JSON.parse(raw) as AppReview[];
  } catch {
    return SEED_REVIEWS;
  }
}

function writeToStorage(reviews: AppReview[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ── useReviews ─────────────────────────────────────────────
// Returns all reviews and a function to add a new one.
export function useReviews() {
  const [reviews, setReviews] = useState<AppReview[]>(readFromStorage);

  const addReview = useCallback(
    (payload: CreateReviewPayload) => {
      const newReview: AppReview = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...payload,
      };
      // Prepend so newest shows first
      const updated = [newReview, ...reviews];
      writeToStorage(updated);
      setReviews(updated);
      return newReview;
    },
    [reviews],
  );

  return { reviews, addReview };
}
