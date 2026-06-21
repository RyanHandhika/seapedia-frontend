// src/components/ui/Skeleton/Skeleton.tsx
//
// Animated placeholder shown while content is loading.
// Looks like a grey bar that shimmers — gives the user a sense
// of the content shape before it arrives (better UX than spinners
// for content-heavy areas like product grids).

import { cn } from "@utils/cn";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const roundedMap = {
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-slate-200 animate-pulse",
        roundedMap[rounded],
        className,
      )}
    />
  );
}

// ── PRODUCT CARD SKELETON ──────────────────────────────────
// Matches the exact layout of <ProductCard> so the screen
// doesn't "jump" when real content loads.
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Image area */}
      <Skeleton className="w-full aspect-[4/3]" rounded="sm" />
      <div className="p-4 space-y-2">
        {/* Store name */}
        <Skeleton className="h-4 w-24" />
        {/* Product name (2 lines) */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        {/* Price */}
        <Skeleton className="h-6 w-32" />
        {/* Rating */}
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}

// Generic table row skeleton
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
