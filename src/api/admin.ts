import { apiGet, apiPost } from "./client";
import type {
  AdminDashboard,
  AdminUser,
  DeliveryJob,
  Order,
  Paginated,
  Promo,
  Store,
  Voucher,
} from "@/types";

interface PageQuery {
  page?: number;
  limit?: number;
  status?: string;
}

export const adminApi = {
  dashboard: () => apiGet<AdminDashboard>("/admin/dashboard"),
  listUsers: (q: PageQuery = {}) =>
    apiGet<Paginated<AdminUser>>("/admin/users", q),
  listStores: (q: PageQuery = {}) =>
    apiGet<Paginated<Store>>("/admin/stores", q),
  listOrders: (q: PageQuery = {}) =>
    apiGet<Paginated<Order>>("/admin/orders", q),
  listOverdue: (q: PageQuery = {}) =>
    apiGet<Paginated<Order>>("/admin/orders/overdue", q),
  listDeliveryJobs: (q: PageQuery = {}) =>
    apiGet<Paginated<DeliveryJob>>("/admin/delivery-jobs", q),

  listVouchers: (q: PageQuery = {}) =>
    apiGet<Paginated<Voucher>>("/admin/vouchers", q),
  createVoucher: (body: {
    code: string;
    discountType: "PERCENT" | "FIXED";
    value: number;
    expiryDate: string;
    usageLimit: number;
  }) => apiPost<Voucher>("/admin/vouchers", body),

  listPromos: (q: PageQuery = {}) =>
    apiGet<Paginated<Promo>>("/admin/promos", q),
  createPromo: (body: {
    code: string;
    discountType: "PERCENT" | "FIXED";
    value: number;
    expiryDate: string;
    description?: string;
  }) => apiPost<Promo>("/admin/promos", body),

  // Time simulation — drives the overdue-order demo.
  getTime: () =>
    apiGet<{ simulatedDate: string; isSimulated: boolean }>(
      "/admin/system/time",
    ),
  advanceDay: () =>
    apiPost<{ simulatedDate: string }>("/admin/system/advance-day"),
  resetTime: () =>
    apiPost<{ simulatedDate: string }>("/admin/system/reset-time"),
  runOverdueCheck: () => apiPost<unknown>("/admin/system/run-overdue-check"),
};
