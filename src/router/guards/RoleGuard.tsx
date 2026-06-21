// src/router/guards/RoleGuard.tsx
//
// The most important guard — enforces role-based access.
//
// Example: <RoleGuard role="BUYER" /> wraps all /buyer/* routes.
// If activeRole !== 'BUYER' → redirect to /unauthorized.
//
// WHY CHECK ON FRONTEND?
// The frontend guard gives instant feedback (no network round-trip).
// The REAL enforcement is always server-side (the backend rejects
// requests with the wrong role). The frontend guard is UX, not security.

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";
import type { Role } from "@types";

interface RoleGuardProps {
  role: Role;
}

export function RoleGuard({ role }: RoleGuardProps) {
  const token = useAuthStore((s) => s.token);
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!token) return <Navigate to="/login" replace />;
  if (!activeRole) return <Navigate to="/role-select" replace />;
  if (activeRole !== role) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
