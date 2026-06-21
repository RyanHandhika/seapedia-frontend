// src/hooks/useAppInit.ts
//
// Runs ONCE when the app mounts.
// If a token exists (from a previous session, restored via
// zustand persist), this fetches fresh user data from /api/auth/me.
//
// If there's NO token, we skip the fetch and immediately stop
// the loading screen (nothing to hydrate — user is a guest).

import { useEffect } from "react";
import { useAuthStore } from "@stores/authStore";
import { useUIStore } from "@stores/uiStore";
import { useCurrentUser } from "@features/auth/hooks/useCurrentUser";

export function useAppInit() {
  const token = useAuthStore((s) => s.token);
  const setLoading = useUIStore((s) => s.setPageLoading);

  // This query auto-runs if `token` exists (see `enabled` in the hook)
  // and turns off isPageLoading in its onSuccess/onError callbacks.
  useCurrentUser();

  useEffect(() => {
    // No token at all → nothing to hydrate, stop loading immediately
    if (!token) {
      setLoading(false);
    }
    // If token exists, useCurrentUser's onSuccess/onError will
    // set isPageLoading to false once the /me request resolves.
  }, [token, setLoading]);
}
