// ═══════════════════════════════════════════════════════════
// src/api/client.ts
//
// The single Axios instance used for ALL API calls in the app.
//
// WHY ONE INSTANCE?
// - We configure base URL once (from .env)
// - Request interceptor: auto-attach JWT token to every request
// - Response interceptor: handle 401/403 globally
//
// HOW IT WORKS:
//   Every feature calls: import { api } from '@api/client'
//   Then: api.get('/products'), api.post('/auth/login', data)
//   Axios adds the baseURL + token automatically.
// ═══════════════════════════════════════════════════════════

import axios, { AxiosError } from "axios";
import { useAuthStore } from "@stores/authStore";

// Create the axios instance
// VITE_API_URL comes from your .env file: VITE_API_URL=http://localhost:4000/api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000, // 15 second timeout
});

// ── REQUEST INTERCEPTOR ────────────────────────────────────
// Runs BEFORE every request is sent.
// Reads the token from Zustand store and adds it to the header.
api.interceptors.request.use((config) => {
  // Get token directly from the store (not a hook — works outside React)
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── RESPONSE INTERCEPTOR ──────────────────────────────────
// Runs AFTER every response (success or error).
api.interceptors.response.use(
  // Success (2xx): pass through unchanged
  (response) => response,

  // Error (4xx, 5xx, network error):
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 401 = token expired or invalid → force logout
      useAuthStore.getState().clearAuth();
      // Redirect to login (can't use useNavigate here, use window directly)
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      // 403 = authenticated but not allowed (wrong role)
      window.location.href = "/unauthorized";
    }

    // Re-throw so individual query/mutation onError handlers still run
    return Promise.reject(error);
  },
);

// ── HELPER: Parse API errors into a readable string ────────
// Usage: catch (e) { toast.error(parseApiError(e)) }
export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Server returned a JSON error body
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;

    // Network error (no response at all)
    if (error.code === "ERR_NETWORK") return "Tidak dapat terhubung ke server.";
    if (error.code === "ECONNABORTED") return "Permintaan timeout. Coba lagi.";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan yang tidak diketahui.";
}
