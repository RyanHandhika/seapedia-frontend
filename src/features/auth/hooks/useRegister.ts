// src/features/auth/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useToast } from "@hooks/useToast";
import { parseApiError } from "@api/client";
import type { RegisterPayload } from "../types/auth.types";

export function useRegister() {
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success("Akun berhasil dibuat! Silakan masuk.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}
