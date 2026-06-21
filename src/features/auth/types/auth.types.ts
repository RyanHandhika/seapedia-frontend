// src/features/auth/types/auth.types.ts
import type { User, Role } from "@types";

// Registration no longer collects roles — every new account is
// automatically a BUYER. Seller/Driver are acquired later via
// the role-upgrade flow (see becomeSellerSchema / becomeDriverSchema).
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  roles: Role[]; // Always includes at least ['BUYER'] for non-admin accounts
}

// ── ROLE UPGRADE ───────────────────────────────────────────
// "Become a Seller" — minimum viable store registration.
// Full store management (description, logo, etc.) lives in Level 2.
export interface BecomeSellerPayload {
  storeName: string;
}

// "Become a Driver" — minimum viable driver registration.
export interface BecomeDriverPayload {
  vehicleType: "MOTOR" | "MOBIL";
  licenseNumber: string; // Nomor SIM
  phoneNumber: string;
}

// Both upgrade endpoints return the user's updated role list,
// so the frontend can immediately reflect the new capability
// without forcing a re-login.
export interface RoleUpgradeResponse {
  roles: Role[];
}
