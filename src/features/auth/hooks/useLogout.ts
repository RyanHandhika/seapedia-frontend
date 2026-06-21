// src/features/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuthStore } from "@stores/authStore";
import { useCartStore } from "@stores/uiStore";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: () => authApi.logout(),
    // onSettled runs WHETHER the API call succeeded or failed.
    // We always clear local state so the user is logged out
    // even if the server-side logout endpoint is temporarily down.
    onSettled: () => {
      clearAuth();
      clearCart();
      queryClient.clear(); // Wipe all cached server data
      navigate("/login");
    },
  });
}
