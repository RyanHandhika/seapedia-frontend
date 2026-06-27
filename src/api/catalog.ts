import { apiGet } from "./client";
import type { Paginated, Product, Store } from "@/types";

export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const catalogApi = {
  listProducts: (q: CatalogQuery = {}) =>
    apiGet<Paginated<Product>>("/catalog/products", q),
  getProduct: (id: string) => apiGet<Product>(`/catalog/products/${id}`),
  getStore: (id: string) =>
    apiGet<{ store: Store; products: Product[] }>(`/catalog/stores/${id}`),
};
