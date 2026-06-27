import { create } from "zustand";
import { authApi } from "@/api/auth";
import {
  setAuthFailureHandler,
  tokenStore,
} from "@/api/client";
import { decodeJwt } from "@/lib/utils";
import type { LoginResult, Role, SafeUser, SwitchableRole } from "@/types";

interface AccessClaims {
  sub: string;
  roles: Role[];
  activeRole: Role;
  sid: string;
  exp: number;
}

interface PendingState {
  rolePendingToken: string;
  roles: Role[];
}

interface AuthState {
  user: SafeUser | null;
  roles: Role[];
  activeRole: Role | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  pending: PendingState | null;

  bootstrap: () => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<LoginResult>;
  completeRoleSelection: (role: SwitchableRole) => Promise<Role>;
  switchRole: (role: SwitchableRole) => Promise<Role>;
  refreshIdentity: () => Promise<void>;
  logout: () => Promise<void>;
}

// Derive active role + roles from the access token already in storage.
function readClaims(): { roles: Role[]; activeRole: Role | null; sub: string | null } {
  const token = tokenStore.getAccess();
  if (!token) return { roles: [], activeRole: null, sub: null };
  const claims = decodeJwt<AccessClaims>(token);
  if (!claims) return { roles: [], activeRole: null, sub: null };
  return { roles: claims.roles ?? [], activeRole: claims.activeRole ?? null, sub: claims.sub };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  roles: [],
  activeRole: null,
  status: "idle",
  pending: null,

  // Called once on app start. If tokens exist, fetch the live profile.
  bootstrap: async () => {
    const token = tokenStore.getAccess();
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }
    set({ status: "loading" });
    try {
      const user = await authApi.me();
      const { roles, activeRole } = readClaims();
      set({
        user,
        roles: user.roles ?? roles,
        activeRole: user.activeRole ?? activeRole,
        status: "authenticated",
      });
    } catch {
      tokenStore.clear();
      set({ status: "unauthenticated", user: null, roles: [], activeRole: null });
    }
  },

  login: async (usernameOrEmail, password) => {
    const result = await authApi.login({ usernameOrEmail, password });
    if (result.requiresRoleSelection) {
      // Multi-role user — hold the pending token, do NOT establish a session.
      set({
        pending: {
          rolePendingToken: result.rolePendingToken,
          roles: result.roles,
        },
        status: "unauthenticated",
      });
      return result;
    }
    // Single-role / admin — full session issued immediately.
    tokenStore.setBoth(result.accessToken, result.refreshToken);
    await get().refreshIdentity();
    return result;
  },

  completeRoleSelection: async (role) => {
    const pending = get().pending;
    if (!pending) throw new Error("No pending role selection");
    const session = await authApi.selectRole(pending.rolePendingToken, role);
    tokenStore.setBoth(session.accessToken, session.refreshToken);
    set({ pending: null });
    await get().refreshIdentity();
    return session.activeRole;
  },

  switchRole: async (role) => {
    const { accessToken, activeRole } = await authApi.switchRole(role);
    tokenStore.setAccess(accessToken);
    set({ activeRole });
    return activeRole;
  },

  refreshIdentity: async () => {
    const user = await authApi.me();
    const { roles, activeRole } = readClaims();
    set({
      user,
      roles: user.roles ?? roles,
      activeRole: user.activeRole ?? activeRole,
      status: "authenticated",
    });
  },

  logout: async () => {
    await authApi.logout();
    set({
      user: null,
      roles: [],
      activeRole: null,
      pending: null,
      status: "unauthenticated",
    });
  },
}));

// Wire the API client's auth-failure hook to force the store into a clean
// logged-out state (e.g. when refresh fails).
setAuthFailureHandler(() => {
  useAuthStore.setState({
    user: null,
    roles: [],
    activeRole: null,
    pending: null,
    status: "unauthenticated",
  });
});
