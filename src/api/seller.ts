import { apiDelete, apiGet, apiPost, apiPostForm, apiPut, apiPutForm } from "./client";
import type { Order, Paginated, Product, Store } from "@/types";

export const sellerApi = {
  getStore: () => apiGet<Store>("/seller/store"),
  updateStore: (body: { storeName?: string; description?: string }) =>
    apiPut<Store>("/seller/store", body),

  listProducts: (params: { page?: number; limit?: number; search?: string } = {}) =>
    apiGet<Paginated<Product>>("/seller/products", params),
  getProduct: (id: string) => apiGet<Product>(`/seller/products/${id}`),

  // Product create/update use multipart so an optional image can be attached.
  createProduct: (form: FormData) =>
    apiPostForm<Product>("/seller/products", form),
  updateProduct: (id: string, form: FormData) =>
    apiPutForm<Product>(`/seller/products/${id}`, form),
  deleteProduct: (id: string) =>
    apiDelete<{ message?: string }>(`/seller/products/${id}`),

  listOrders: (params: { page?: number; limit?: number; status?: string } = {}) =>
    apiGet<Paginated<Order>>("/seller/orders", params),
  getOrder: (id: string) => apiGet<Order>(`/seller/orders/${id}`),
  processOrder: (id: string) =>
    apiPost<Order>(`/seller/orders/${id}/process`),
  incomeReport: () => apiGet<unknown>("/seller/reports/income"),
};
