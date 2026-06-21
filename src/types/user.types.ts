// ═══════════════════════════════════════════════════════════
// src/types/user.types.ts
//
// All types related to users and roles.
// These are used everywhere in the app, so they live in /types.
// ═══════════════════════════════════════════════════════════

// ── ROLES ──────────────────────────────────────────────────
// SEAPEDIA has 4 roles. Non-admin users can hold multiple roles.
export type Role = "BUYER" | "SELLER" | "DRIVER" | "ADMIN";

// Human-readable role labels in Bahasa Indonesia
export const ROLE_LABELS: Record<Role, string> = {
  BUYER: "Pembeli",
  SELLER: "Penjual",
  DRIVER: "Pengirim",
  ADMIN: "Admin",
};

// Each role has a color used for badges, borders, and accents
export const ROLE_COLORS: Record<Role, string> = {
  BUYER: "teal",
  SELLER: "amber",
  DRIVER: "blue",
  ADMIN: "purple",
};

// Dashboard route for each role — used after login/role selection
export const ROLE_DASHBOARD: Record<Role, string> = {
  BUYER: "/buyer",
  SELLER: "/seller",
  DRIVER: "/driver",
  ADMIN: "/admin",
};

// ── USER ───────────────────────────────────────────────────
// The core User object returned from the API
export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[]; // A user can own multiple roles (except Admin is exclusive)
  createdAt: string; // ISO 8601 date string
}
