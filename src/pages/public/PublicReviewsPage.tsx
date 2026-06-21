import { ReviewList } from "@features/review/components/ReviewList";
import { ReviewForm } from "@features/review/components/ReviewForm";
import { useReviews } from "@features/review/hooks/useReviews";
import { Card } from "@components/ui/Card/Card";

export default function PublicReviewsPage() {
  const { reviews } = useReviews();
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-display text-slate-800 mb-2">
          Ulasan Pengguna
        </h1>
        <p className="text-slate-500">
          {reviews.length} ulasan dari pengguna SEAPEDIA
        </p>
      </div>
      <ReviewList reviews={reviews} />
      <div className="max-w-lg mx-auto mt-14">
        <h2 className="text-xl font-semibold text-slate-800 text-center mb-6">
          Tulis Ulasanmu
        </h2>
        <Card>
          <ReviewForm />
        </Card>
      </div>
    </div>
  );
}
