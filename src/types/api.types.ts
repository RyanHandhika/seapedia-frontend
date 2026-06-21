// ═══════════════════════════════════════════════════════════
// src/types/api.types.ts
//
// Standard shapes for every API response from the backend.
// Using generics (<T>) means we reuse ONE type for all endpoints.
// ═══════════════════════════════════════════════════════════

// ── GENERIC API RESPONSE ───────────────────────────────────
// Every endpoint returns this shape:
//   { success: true, message: "OK", data: { ... } }
//   { success: false, message: "Not found", data: null }
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── PAGINATED RESPONSE ─────────────────────────────────────
// Used for lists: products, orders, etc.
// Example usage: ApiResponse<PaginatedResponse<Product>>
export interface PaginatedResponse<T> {
  items: T[];
  total: number; // Total number of records (for pagination math)
  page: number; // Current page (1-indexed)
  limit: number; // Items per page
  totalPages: number;
}

// ── API ERROR ──────────────────────────────────────────────
// When the server returns a 4xx or 5xx, it includes this shape.
// 'errors' is a map of field → error messages (for form validation).
// Example: { message: "Validation failed", errors: { email: ["Email sudah digunakan"] } }
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ═══════════════════════════════════════════════════════════
// src/types/order.types.ts
//
// Order status is the core lifecycle of SEAPEDIA.
// These exact status names are required by COMPFEST.
// ═══════════════════════════════════════════════════════════

// The 5 main statuses from the COMPFEST spec (do NOT rename these)
export type OrderStatus =
  | "SEDANG_DIKEMAS" // Seller is packing the order
  | "MENUNGGU_PENGIRIM" // Ready for a driver to take
  | "SEDANG_DIKIRIM" // Driver is delivering
  | "PESANAN_SELESAI" // Order completed successfully
  | "DIKEMBALIKAN"; // Order returned (overdue or cancelled)

// Human-readable labels for display in the UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  SEDANG_DIKEMAS: "Sedang Dikemas",
  MENUNGGU_PENGIRIM: "Menunggu Pengirim",
  SEDANG_DIKIRIM: "Sedang Dikirim",
  PESANAN_SELESAI: "Pesanan Selesai",
  DIKEMBALIKAN: "Dikembalikan",
};

// Color mapping for StatusBadge component
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  SEDANG_DIKEMAS: "amber",
  MENUNGGU_PENGIRIM: "blue",
  SEDANG_DIKIRIM: "indigo",
  PESANAN_SELESAI: "green",
  DIKEMBALIKAN: "red",
};

// Delivery methods (exactly as required by COMPFEST)
export type DeliveryMethod = "INSTANT" | "NEXT_DAY" | "REGULAR";

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  INSTANT: "Instant (2-4 jam)",
  NEXT_DAY: "Next Day (1 hari)",
  REGULAR: "Regular (3-5 hari)",
};
