import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { PageLoader } from "@/components/ui";
import { ROLE_HOME } from "@/lib/utils";
import type { Role } from "@/types";

// Gate for any authenticated area. Waits for bootstrap to settle before
// deciding, so a hard refresh doesn't bounce a logged-in user to /login.
export function RequireAuth() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === "idle" || status === "loading") return <PageLoader />;
  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

// Gate for a specific role dashboard. If the user is authenticated but the
// active role doesn't match, redirect to their actual role home.
export function RequireRole({ role }: { role: Role }) {
  const status = useAuthStore((s) => s.status);
  const activeRole = useAuthStore((s) => s.activeRole);
  const roles = useAuthStore((s) => s.roles);

  if (status === "idle" || status === "loading") return <PageLoader />;
  if (status === "unauthenticated") return <Navigate to="/auth/login" replace />;

  // Admin only ever has the admin area.
  if (activeRole && activeRole !== role) {
    // If they own the role but it isn't active, the switch happens via the UI;
    // here we just send them to their current active home.
    const home = activeRole ? ROLE_HOME[activeRole] : "/role-selection";
    return <Navigate to={home} replace />;
  }
  if (!roles.includes(role)) {
    return <Navigate to="/role-selection" replace />;
  }
  return <Outlet />;
}
