// src/features/review/components/ReviewList.tsx

import { MessageSquare } from "lucide-react";
import { ReviewCard } from "./ReviewCard";
import { EmptyState } from "@components/ui/EmptyState/EmptyState";
import type { AppReview } from "../types/review.types";

interface ReviewListProps {
  reviews: AppReview[];
  limit?: number; // Show only first N reviews (e.g. 3 on landing page)
}

export function ReviewList({ reviews, limit }: ReviewListProps) {
  const displayed = limit ? reviews.slice(0, limit) : reviews;

  if (displayed.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare size={40} />}
        title="Belum ada ulasan"
        description="Jadilah yang pertama memberikan ulasan tentang SEAPEDIA!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayed.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
