import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@utils/cn";

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  error?: string;
}

export function StarRatingInput({
  value,
  onChange,
  disabled,
  error,
}: StarRatingInputProps) {
  // hovered tracks which star the mouse is over (for preview)
  const [hovered, setHovered] = useState(0);

  // The displayed rating: show hovered preview, fall back to selected value
  const displayed = hovered || value;

  const LABELS: Record<number, string> = {
    1: "Buruk",
    2: "Kurang",
    3: "Cukup",
    4: "Bagus",
    5: "Sangat Bagus",
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1",
          disabled && "opacity-50 pointer-events-none",
        )}
        role="radiogroup"
        aria-label="Rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button" // Prevent form submission on click
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} bintang — ${LABELS[star]}`}
            className="p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <Star
              size={28}
              className={cn(
                "transition-colors duration-100",
                star <= displayed
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300",
              )}
            />
          </button>
        ))}

        {/* Label next to stars */}
        {displayed > 0 && (
          <span className="ml-2 text-sm font-medium text-slate-600">
            {LABELS[displayed]}
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
}
