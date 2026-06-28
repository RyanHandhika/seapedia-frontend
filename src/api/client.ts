import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types";

const ACCESS_KEY = "seapedia.accessToken";
const REFRESH_KEY = "seapedia.refreshToken";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setAccess: (t: string) => localStorage.setItem(ACCESS_KEY, t),
  setRefresh: (t: string) => localStorage.setItem(REFRESH_KEY, t),
  setBoth: (a: string, r: string) => {
    localStorage.setItem(ACCESS_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiException extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(
    message: string,
    code: string,
    status: number,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

let onAuthFailure: (() => void) | null = null;
export function setAuthFailureHandler(fn: () => void) {
  onAuthFailure = fn;
}

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
  const accessToken = res.data?.data?.accessToken as string | undefined;
  if (!accessToken) throw new Error("Refresh returned no token");
  tokenStore.setAccess(accessToken);
  return accessToken;
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const status = error.response?.status ?? 0;
    const isAuthRoute = original?.url?.includes("/auth/");

    if (status === 401 && original && !original._retried && !isAuthRoute) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? performRefresh();
        const newToken = await refreshPromise;
        refreshPromise = null;
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch {
        refreshPromise = null;
        tokenStore.clear();
        onAuthFailure?.();
      }
    }

    const payload = error.response?.data;
    throw new ApiException(
      payload?.message ?? error.message ?? "Request failed",
      payload?.code ?? "NETWORK_ERROR",
      status,
      payload?.errors,
    );
  },
);

export async function apiGet<T>(url: string, params?: object): Promise<T> {
  const res = await http.get(url, { params });
  return res.data.data as T;
}
export async function apiPost<T>(url: string, body?: object): Promise<T> {
  const res = await http.post(url, body ?? {});
  return res.data.data as T;
}
export async function apiPut<T>(url: string, body?: object): Promise<T> {
  const res = await http.put(url, body ?? {});
  return res.data.data as T;
}
export async function apiDelete<T>(url: string): Promise<T> {
  const res = await http.delete(url);
  return res.data.data as T;
}

export async function apiPostForm<T>(url: string, form: FormData): Promise<T> {
  const res = await http.post(url, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data as T;
}
export async function apiPutForm<T>(url: string, form: FormData): Promise<T> {
  const res = await http.put(url, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data as T;
}
