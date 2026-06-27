import { useMemo, useState } from "react";
import { useReviews } from "./reviewHooks";
import { StarRating } from "./StarRating";
import { Badge, Skeleton, EmptyState } from "@/components/ui";
import type { AppReview, Role } from "@/types";

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "?";
}

const ROLE_META: Record<
  Exclude<Role, "ADMIN">,
  { label: string; tone: "green" | "coral" | "blue" }
> = {
  BUYER: { label: "Buyer", tone: "green" },
  SELLER: { label: "Seller", tone: "coral" },
  DRIVER: { label: "Driver", tone: "blue" },
};

type FilterKey = "ALL" | "BUYER" | "SELLER" | "DRIVER";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "BUYER", label: "Buyers" },
  { key: "SELLER", label: "Sellers" },
  { key: "DRIVER", label: "Drivers" },
];

export function ReviewsSection() {
  const { data, isLoading } = useReviews(1, 24);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  const allReviews = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const avg = useMemo(() => {
    if (allReviews.length === 0) return 0;
    return allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  }, [allReviews]);

  const counts = useMemo(() => {
    const c = { BUYER: 0, SELLER: 0, DRIVER: 0 };
    for (const r of allReviews) {
      if (r.reviewerRole === "BUYER") c.BUYER++;
      else if (r.reviewerRole === "SELLER") c.SELLER++;
      else if (r.reviewerRole === "DRIVER") c.DRIVER++;
    }
    return c;
  }, [allReviews]);

  const filtered = useMemo(
    () =>
      filter === "ALL"
        ? allReviews
        : allReviews.filter((r) => r.reviewerRole === filter),
    [allReviews, filter],
  );

  // Duplicate the list so the marquee can loop seamlessly (translateX -50%
  // lands exactly on the start of the second copy).
  const track = filtered.length > 0 ? [...filtered, ...filtered] : [];

  return (
    <section
      id="reviews"
      className="overflow-hidden border-t border-ink-100 bg-gradient-to-b from-foam to-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Header + summary */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
            Loved by the community
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            What people say about SEAPEDIA
          </h2>
          {total > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-ink-900">
                {avg.toFixed(1)}
              </span>
              <div className="text-left">
                <StarRating value={avg} />
                <p className="text-xs text-ink-400">
                  {total} review{total === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Role filter */}
        {allReviews.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => {
              const count = f.key === "ALL" ? allReviews.length : counts[f.key];
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === f.key
                      ? "bg-brand-500 text-white"
                      : "border border-ink-200 bg-white text-ink-600 hover:border-brand-300"
                  }`}
                >
                  {f.label} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Marquee */}
      <div className="mt-4 pb-16">
        {isLoading ? (
          <div className="mx-auto flex max-w-7xl gap-5 px-4 lg:px-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-80 shrink-0" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <EmptyState
              icon="💬"
              title={
                allReviews.length === 0
                  ? "No reviews yet"
                  : "No reviews from this group yet"
              }
              description={
                allReviews.length === 0
                  ? "Reviews from our community will appear here."
                  : "Try a different filter to see more perspectives."
              }
            />
          </div>
        ) : (
          // group + edge fade. The inner track animates left forever and pauses
          // on hover via group-hover.
          <div className="group relative">
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-foam to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

            <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
              {track.map((r, i) => (
                <ReviewCard key={`${r.id}-${i}`} review={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review: r }: { review: AppReview }) {
  const meta =
    r.reviewerRole && r.reviewerRole !== "ADMIN"
      ? ROLE_META[r.reviewerRole]
      : null;
  return (
    <div className="relative w-80 shrink-0 overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      {/* big quote mark */}
      <span className="pointer-events-none absolute -right-2 -top-3 font-display text-7xl leading-none text-brand-100 select-none">
        &rdquo;
      </span>
      <div className="relative">
        <StarRating value={r.rating} size="sm" />
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-700">
          {r.comment}
        </p>
        <div className="mt-5 flex items-center gap-3 border-t border-ink-50 pt-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
            {initials(r.reviewerName)}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-ink-900">
                {r.reviewerName}
              </p>
              {meta && <Badge tone={meta.tone}>{meta.label}</Badge>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
