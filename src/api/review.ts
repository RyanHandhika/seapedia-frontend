import { apiGet, apiPost } from "./client";
import type { AppReview, Paginated } from "@/types";

export const reviewApi = {
  list: (page = 1, limit = 10) =>
    apiGet<Paginated<AppReview>>("/reviews", { page, limit }),

  // Reviews are about the SEAPEDIA app itself. Auth is optional on the backend,
  // so guests can submit too — reviewerName is always supplied by the form.
  submit: (body: { reviewerName: string; rating: number; comment: string }) =>
    apiPost<AppReview>("/reviews", body),
};
