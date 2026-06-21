// src/features/review/components/ReviewForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { reviewSchema, type ReviewFormValues } from "../types/review.schemas";
import { useReviews } from "../hooks/useReviews";
import { Input } from "@components/ui/Input/Input";
import { Textarea } from "@components/ui/Input/Input";
import { Button } from "@components/ui/Button/Button";
import { StarRatingInput } from "@components/shared/StarRatingInput/StarRatingInput";

interface ReviewFormProps {
  onSuccess?: () => void; // Optional callback after submission
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { addReview } = useReviews();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const commentValue = watch("comment", "");

  const onSubmit = async (data: ReviewFormValues) => {
    addReview(data);
    setSubmitted(true);
    onSuccess?.();
    // Reset form and hide success state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 3000);
  };

  // ── SUCCESS STATE ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h3 className="font-semibold text-slate-800">
          Terima kasih atas ulasanmu!
        </h3>
        <p className="text-sm text-slate-500">
          Ulasan kamu sudah berhasil dikirim.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Nama Kamu"
        placeholder="Masukkan nama kamu"
        error={errors.reviewerName?.message}
        required
        {...register("reviewerName")}
      />

      {/* StarRatingInput needs Controller because it's not a native input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRatingInput
              value={field.value}
              onChange={field.onChange}
              error={errors.rating?.message}
            />
          )}
        />
      </div>

      <Textarea
        label="Komentar"
        placeholder="Bagikan pengalaman kamu menggunakan SEAPEDIA..."
        error={errors.comment?.message}
        required
        rows={4}
        maxCount={500}
        value={commentValue}
        {...register("comment")}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        Kirim Ulasan
      </Button>
    </form>
  );
}
