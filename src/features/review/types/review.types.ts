// src/features/review/types/review.types.ts
export interface AppReview {
  id: string;
  reviewerName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string; // ISO 8601
}

export interface CreateReviewPayload {
  reviewerName: string;
  rating: number;
  comment: string;
}
