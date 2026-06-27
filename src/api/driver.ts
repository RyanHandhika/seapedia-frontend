import { apiGet, apiPost } from "./client";
import type { DeliveryJob, DriverEarnings, Paginated } from "@/types";

export const driverApi = {
  listAvailable: (page = 1, limit = 10) =>
    apiGet<Paginated<DeliveryJob>>("/driver/jobs/available", { page, limit }),
  getActive: () => apiGet<DeliveryJob | null>("/driver/jobs/active"),
  getHistory: (page = 1, limit = 10) =>
    apiGet<Paginated<DeliveryJob>>("/driver/jobs/history", { page, limit }),
  getJob: (id: string) => apiGet<DeliveryJob>(`/driver/jobs/${id}`),
  takeJob: (id: string) => apiPost<DeliveryJob>(`/driver/jobs/${id}/take`),
  completeJob: (id: string) =>
    apiPost<{ message: string; earning: number; jobId: string; orderId: string }>(
      `/driver/jobs/${id}/complete`,
    ),
  getEarnings: () => apiGet<DriverEarnings>("/driver/earnings"),
};
