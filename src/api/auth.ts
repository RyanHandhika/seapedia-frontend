import { apiGet, apiPost, http, tokenStore } from "./client";
import type {
  LoginResult,
  MeSummary,
  Role,
  SafeUser,
  SwitchableRole,
} from "@/types";

export const authApi = {
  register: (body: { username: string; email: string; password: string }) =>
    apiPost<SafeUser>("/auth/register", body),

  login: (body: { usernameOrEmail: string; password: string }) =>
    apiPost<LoginResult>("/auth/login", body),

  // Completes the role-pending handshake. The role-pending token is passed as
  // a Bearer header directly (it is NOT the normal access token).
  selectRole: async (rolePendingToken: string, role: SwitchableRole) => {
    const res = await http.post(
      "/auth/select-role",
      { role },
      { headers: { Authorization: `Bearer ${rolePendingToken}` } },
    );
    return res.data.data as {
      activeRole: Role;
      accessToken: string;
      refreshToken: string;
    };
  },

  switchRole: (role: SwitchableRole) =>
    apiPost<{ accessToken: string; activeRole: Role }>("/auth/switch-role", {
      role,
    }),

  logout: async () => {
    try {
      await apiPost("/auth/logout");
    } finally {
      tokenStore.clear();
    }
  },

  me: () => apiGet<SafeUser>("/auth/me"),
  summary: () => apiGet<MeSummary>("/me/summary"),
  myRoles: () =>
    apiGet<{ roles: Role[]; activeRole: Role }>("/profile/roles"),

  becomeSeller: (body: { storeName: string; description?: string }) =>
    apiPost<{ message: string; store: { id: string; storeName: string } }>(
      "/profile/become-seller",
      body,
    ),
  becomeDriver: () =>
    apiPost<{ message: string }>("/profile/become-driver"),
};
