// src/features/auth/hooks/useBecomeSeller.ts
//
// "Become a Seller" — the role-upgrade mutation.
// On success: adds SELLER to the user's roles (without touching
// their other roles), switches activeRole to SELLER immediately,
// and sends them into the seller dashboard — matching the
// Shopee/Tokopedia pattern of dropping you straight into Seller
// Center right after you open a store.

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { roleUpgradeApi } from "../api/roleUpgradeApi";
import { useAuthStore } from "@stores/authStore";
import { useToast } from "@hooks/useToast";
import { parseApiError } from "@api/client";
import type { BecomeSellerPayload } from "../types/auth.types";

export function useBecomeSeller() {
  const navigate = useNavigate();
  const toast = useToast();
  const addRole = useAuthStore((s) => s.addRole);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  return useMutation({
    mutationFn: (payload: BecomeSellerPayload) =>
      roleUpgradeApi.becomeSeller(payload),

    onSuccess: () => {
      addRole("SELLER");
      setActiveRole("SELLER");
      toast.success("Selamat! Toko kamu berhasil dibuat 🎉");
      navigate("/seller");
    },

    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}
