// src/features/auth/api/authApi.ts
// Raw API call functions — no React, no hooks, pure async functions

import { api } from "@api/client";
import { ENDPOINTS } from "@api/endpoints";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "../types/auth.types";
import type { User } from "@types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    api
      .post<{ data: AuthResponse }>(ENDPOINTS.AUTH.REGISTER, payload)
      .then((r) => r.data.data),

  login: (payload: LoginPayload) =>
    api
      .post<{ data: AuthResponse }>(ENDPOINTS.AUTH.LOGIN, payload)
      .then((r) => r.data.data),

  logout: () => api.post(ENDPOINTS.AUTH.LOGOUT),

  getMe: () =>
    api.get<{ data: User }>(ENDPOINTS.AUTH.ME).then((r) => r.data.data),
};
