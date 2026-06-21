import { Star } from "lucide-react";
import { cn } from "@utils/cn";

interface StarRatingProps {
  rating: number; // 0–5, supports decimals
  count?: number; // Review count label
  size?: "sm" | "md";
}

export function StarRating({ rating, count, size = "md" }: StarRatingProps) {
  const starSize = size === "sm" ? 12 : 14;
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1", textClass)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={cn(
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200",
            )}
          />
        ))}
      </div>
      <span className="font-medium text-slate-700">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-slate-400">
          ({count.toLocaleString("id-ID")} ulasan)
        </span>
      )}
    </div>
  );
}
