import { StarRating } from "@components/shared/StarRating/StarRating";
import { formatDate } from "@utils/date";
import type { AppReview } from "../types/review.types";

interface ReviewCardProps {
  review: AppReview;
}

// Generate a consistent color for avatar based on the first letter
function getAvatarColor(name: string): string {
  const colors = [
    "bg-teal-500",
    "bg-blue-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-emerald-500",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.reviewerName.slice(0, 2).toUpperCase();
  const avatarColor = getAvatarColor(review.reviewerName);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
      {/* Header: avatar + name + date */}
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {review.reviewerName}
          </p>
          <p className="text-xs text-slate-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>

      <StarRating rating={review.rating} size="sm" />

      {/* Safe text rendering — React escapes this by default (XSS safe) */}
      <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
    </div>
  );
}
