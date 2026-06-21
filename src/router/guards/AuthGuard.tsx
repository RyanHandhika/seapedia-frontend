// src/router/guards/AuthGuard.tsx
// Protects routes that require a logged-in user.
// If no token → redirect to /login.
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@stores/authStore";

export function AuthGuard() {
  const token = useAuthStore((s) => s.token);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
