import { QueryClient } from "@tanstack/react-query";
import { ApiException } from "@/api/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Never retry auth/permission errors — only transient ones.
        if (error instanceof ApiException && [401, 403, 404, 409].includes(error.status)) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: { retry: false },
  },
});

// Centralized query keys so invalidation stays consistent across features.
export const qk = {
  me: ["me"] as const,
  summary: ["summary"] as const,
  catalog: (params: object) => ["catalog", params] as const,
  product: (id: string) => ["product", id] as const,
  cart: ["cart"] as const,
  wallet: ["wallet"] as const,
  walletTx: (page: number) => ["wallet-tx", page] as const,
  addresses: ["addresses"] as const,
  buyerOrders: (params: object) => ["buyer-orders", params] as const,
  buyerOrder: (id: string) => ["buyer-order", id] as const,
  sellerStore: ["seller-store"] as const,
  sellerProducts: (params: object) => ["seller-products", params] as const,
  sellerOrders: (params: object) => ["seller-orders", params] as const,
  sellerOrder: (id: string) => ["seller-order", id] as const,
  driverAvailable: (page: number) => ["driver-available", page] as const,
  driverActive: ["driver-active"] as const,
  driverHistory: (page: number) => ["driver-history", page] as const,
  driverEarnings: ["driver-earnings"] as const,
  adminDashboard: ["admin-dashboard"] as const,
  adminUsers: (params: object) => ["admin-users", params] as const,
  adminStores: (params: object) => ["admin-stores", params] as const,
  adminOrders: (params: object) => ["admin-orders", params] as const,
  adminVouchers: (params: object) => ["admin-vouchers", params] as const,
  adminPromos: (params: object) => ["admin-promos", params] as const,
  adminTime: ["admin-time"] as const,
};
