// src/features/auth/types/auth.types.ts
import type { User, Role } from "@types";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: Role[]; // User chooses roles at registration
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  roles: Role[];
}
