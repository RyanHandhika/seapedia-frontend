import { useMemo } from "react";
import { useReviews } from "./reviewHooks";
import { StarRating } from "./StarRating";
import { Card, CardBody, Skeleton, EmptyState } from "@/components/ui";
import { relativeTime } from "@/lib/utils";

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "?";
}

// Read-only reviews for the public landing page. Writing a review happens in
// the logged-in dashboard (anti-spam: only real accounts can post), so there's
// no submit UI here — this section is purely social proof for visitors.
export function ReviewsSection() {
  const { data, isLoading } = useReviews(1, 6);

  const reviews = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  const avg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <section id="reviews" className="border-t border-ink-100 bg-foam">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        {/* Header + summary */}
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">
            What people say about SEAPEDIA
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Reviews from our community about the app experience.
          </p>
          {total > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <span className="font-display text-3xl font-bold text-ink-900">
                {avg.toFixed(1)}
              </span>
              <div>
                <StarRating value={avg} />
                <p className="text-xs text-ink-400">
                  {total} review{total === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Reviews grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon="💬"
              title="No reviews yet"
              description="Reviews from our community will appear here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <Card key={r.id} accent>
                  <CardBody>
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
                        {initials(r.reviewerName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink-900">
                          {r.reviewerName}
                        </p>
                        <p className="text-xs text-ink-400">
                          {relativeTime(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <StarRating value={r.rating} size="sm" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {r.comment}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
