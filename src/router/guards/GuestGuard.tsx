// src/router/guards/GuestGuard.tsx
// Prevents authenticated users from visiting /login or /register.
// If already logged in → redirect to role-select or dashboard.
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";
import { ROLE_DASHBOARD } from "@types";

export function GuestGuard() {
  const token = useAuthStore((s) => s.token);
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!token) return <Outlet />;
  // Already authenticated — send them where they belong
  return (
    <Navigate
      to={activeRole ? ROLE_DASHBOARD[activeRole] : "/role-select"}
      replace
    />
  );
}
