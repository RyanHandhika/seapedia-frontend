import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DeliveryMethod, OrderStatus, Role } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indonesian Rupiah formatting — the backend stores Decimal(12,2) as strings.
export function idr(value: string | number | null | undefined): string {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

export function num(value: string | number | null | undefined): number {
  const n = typeof value === "string" ? parseFloat(value) : value ?? 0;
  return Number.isFinite(n) ? n : 0;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso?: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

// Decode a JWT payload without verifying (client-side display only).
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// ── Human-readable maps for backend enums ────────────────────────────────────
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  SEDANG_DIKEMAS: "Being packed",
  MENUNGGU_PENGIRIM: "Waiting for driver",
  SEDANG_DIKIRIM: "Out for delivery",
  PESANAN_SELESAI: "Completed",
  DIKEMBALIKAN: "Returned",
};

export const ORDER_STATUS_TONE: Record<
  OrderStatus,
  "amber" | "blue" | "violet" | "green" | "red"
> = {
  SEDANG_DIKEMAS: "amber",
  MENUNGGU_PENGIRIM: "blue",
  SEDANG_DIKIRIM: "violet",
  PESANAN_SELESAI: "green",
  DIKEMBALIKAN: "red",
};

export const DELIVERY_LABEL: Record<DeliveryMethod, string> = {
  INSTANT: "Instant (≤3h)",
  NEXT_DAY: "Next day (≤24h)",
  REGULAR: "Regular (≤72h)",
};

export const DELIVERY_FEE: Record<DeliveryMethod, number> = {
  INSTANT: 50000,
  NEXT_DAY: 25000,
  REGULAR: 15000,
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  SELLER: "Seller",
  BUYER: "Buyer",
  DRIVER: "Driver",
};

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  SELLER: "/seller/dashboard",
  BUYER: "/buyer/dashboard",
  DRIVER: "/driver/dashboard",
};
