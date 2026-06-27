import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/api/review";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function useReviews(page = 1, limit = 6) {
  return useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => reviewApi.list(page, limit),
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      reviewerName: string;
      rating: number;
      comment: string;
    }) => reviewApi.submit(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Thanks for your review!");
    },
    onError: (e) =>
      toast.error(
        e instanceof ApiException ? e.message : "Could not submit review",
      ),
  });
}
