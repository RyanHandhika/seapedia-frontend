// ═══════════════════════════════════════════════════════════
// src/stores/authStore.ts
//
// Zustand store for authentication state.
//
// WHAT IS ZUSTAND?
// Zustand is a simple state management library. It's like a
// global variable that React components can "subscribe" to —
// when the variable changes, all subscribed components re-render.
//
// WHY NOT USE REACT CONTEXT?
// Context re-renders ALL consumers on any change.
// Zustand is smarter — components only re-render when the
// specific slice of state they USE actually changes.
//
// WHAT DOES THIS STORE HOLD?
// - token: the JWT from the backend (sent in every API request)
// - user:  the logged-in user's info
// - activeRole: which role is currently active (BUYER/SELLER/etc.)
// - roles: ALL roles owned by this user
// ═══════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "@types";

interface AuthState {
  // ── STATE ─────────────────────────────────────────────────
  token: string | null;
  user: User | null;
  activeRole: Role | null;
  roles: Role[];

  // ── ACTIONS ───────────────────────────────────────────────
  // Called after a successful login
  setAuth: (token: string, user: User, roles: Role[]) => void;

  // Called when user picks a role on the RoleSelectionPage
  setActiveRole: (role: Role) => void;

  // Called on logout — clears EVERYTHING
  clearAuth: () => void;

  // Called after re-fetching /me to update user info
  updateUser: (partial: Partial<User>) => void;

  // ── HELPERS ───────────────────────────────────────────────
  isAuthenticated: () => boolean;
  hasRole: (role: Role) => boolean;
}

export const useAuthStore = create<AuthState>()(
  // 'persist' saves the store to localStorage automatically.
  // When the user refreshes the page, the token and activeRole
  // are restored from localStorage instead of being lost.
  persist(
    (set, get) => ({
      // Initial state — all null/empty until login
      token: null,
      user: null,
      activeRole: null,
      roles: [],

      setAuth: (token, user, roles) => {
        set({ token, user, roles, activeRole: null });
        // Note: activeRole stays null until the user picks one
        // (or auto-selected if only 1 role)
      },

      setActiveRole: (role) => {
        set({ activeRole: role });
      },

      clearAuth: () => {
        // Reset EVERYTHING to initial state
        set({ token: null, user: null, activeRole: null, roles: [] });
      },

      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...partial } });
      },

      // Derived "computed" values — calculated from state on the fly
      isAuthenticated: () => !!get().token,
      hasRole: (role) => get().roles.includes(role),
    }),
    {
      name: "seapedia-auth", // localStorage key name

      // SECURITY: Only persist the token and activeRole.
      // The full 'user' object is re-fetched from /api/auth/me
      // on every page load to ensure it's always fresh.
      partialize: (state) => ({
        token: state.token,
        activeRole: state.activeRole,
      }),
    },
  ),
);
