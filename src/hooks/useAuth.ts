// ═══════════════════════════════════════════════════════════
// src/hooks/useAuth.ts
//
// Convenience hook that wraps authStore selectors.
// Components import THIS instead of authStore directly —
// it's a cleaner API and easier to test.
// ═══════════════════════════════════════════════════════════

import { useAuthStore } from "@stores/authStore";
import { ROLE_DASHBOARD } from "@types";

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const roles = useAuthStore((s) => s.roles);

  return {
    token,
    user,
    activeRole,
    roles,
    isAuthenticated: !!token,
    hasRole: (role: string) => roles.includes(role as never),
    // The dashboard URL for the active role
    dashboardPath: activeRole ? ROLE_DASHBOARD[activeRole] : "/role-select",
  };
}
