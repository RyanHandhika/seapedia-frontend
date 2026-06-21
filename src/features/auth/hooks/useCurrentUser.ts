// src/features/auth/hooks/useCurrentUser.ts
//
// Fetches the current user profile from /api/auth/me.
// Runs on every page load to keep user data fresh.
// If the token is expired, the API returns 401 →
// the axios interceptor clears auth and redirects to /login.
//
// NOTE: TanStack Query v5 removed onSuccess/onError/onSettled from
// useQuery (they still exist on useMutation). The v5-recommended
// pattern is to react to `data` / `isError` with a useEffect instead.

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "@stores/authStore";
import { useUIStore } from "@stores/uiStore";

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);
  const setLoading = useUIStore((s) => s.setPageLoading);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),

    // Only run this query if the user has a token
    // (no point hitting /me when not logged in)
    enabled: !!token,

    // Keep user data for 5 minutes before re-fetching
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry auth errors
  });

  // React to success: hydrate the user object into authStore
  useEffect(() => {
    if (query.data) {
      updateUser(query.data);
      setLoading(false);
    }
  }, [query.data, updateUser, setLoading]);

  // React to failure: 401 is already handled globally by the axios
  // interceptor (clearAuth + redirect). Here we just stop the
  // full-screen loading state so the UI doesn't hang.
  useEffect(() => {
    if (query.isError) {
      setLoading(false);
    }
  }, [query.isError, setLoading]);

  return query;
}
