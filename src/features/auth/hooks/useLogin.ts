// src/features/auth/hooks/useLogin.ts
//
// useMutation = TanStack Query for POST/PUT/DELETE operations.
// It gives us: mutate(), isLoading, isError, etc.

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuthStore } from "@stores/authStore";
import { useToast } from "@hooks/useToast";
import { parseApiError } from "@api/client";
import { ROLE_DASHBOARD } from "@types";
import type { LoginPayload } from "../types/auth.types";

export function useLogin() {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (data) => {
      // 1. Store token + user + roles in Zustand (persisted to localStorage)
      setAuth(data.token, data.user, data.roles);

      // 2. Decide where to navigate next
      const nonAdminRoles = data.roles.filter((r) => r !== "ADMIN");

      if (data.roles.includes("ADMIN")) {
        // Admin users skip role selection — go straight to admin dashboard
        setActiveRole("ADMIN");
        navigate("/admin");
      } else if (nonAdminRoles.length === 1) {
        // Only one role → skip selection, go directly to dashboard
        setActiveRole(nonAdminRoles[0]);
        navigate(ROLE_DASHBOARD[nonAdminRoles[0]]);
      } else {
        // Multiple roles → let user choose
        navigate("/role-select");
      }
    },

    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}
