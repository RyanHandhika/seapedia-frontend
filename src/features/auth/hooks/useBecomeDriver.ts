// src/features/auth/hooks/useBecomeDriver.ts
//
// "Become a Driver" — same pattern as useBecomeSeller.

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { roleUpgradeApi } from "../api/roleUpgradeApi";
import { useAuthStore } from "@stores/authStore";
import { useToast } from "@hooks/useToast";
import { parseApiError } from "@api/client";
import type { BecomeDriverPayload } from "../types/auth.types";

export function useBecomeDriver() {
  const navigate = useNavigate();
  const toast = useToast();
  const addRole = useAuthStore((s) => s.addRole);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  return useMutation({
    mutationFn: (payload: BecomeDriverPayload) =>
      roleUpgradeApi.becomeDriver(payload),

    onSuccess: () => {
      addRole("DRIVER");
      setActiveRole("DRIVER");
      toast.success("Selamat! Kamu sekarang adalah mitra Pengirim 🎉");
      navigate("/driver");
    },

    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}
