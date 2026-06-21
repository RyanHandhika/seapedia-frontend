// src/features/product/hooks/useProducts.ts
//
// Returns products from dummy data (Level 1).
// In Level 2, swap the queryFn to call the real API —
// everything else (filtering, pagination) stays the same.

import { useQuery } from "@tanstack/react-query";
import { dummyProducts } from "../data/dummyProducts";
import type { Product } from "../types/product.types";

interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "relevance";
  storeId?: string;
  page?: number;
  limit?: number;
}

// ── useProducts ────────────────────────────────────────────
// Returns a paginated, filtered list of products.
export function useProducts(filters: ProductFilters = {}) {
  const {
    search = "",
    minPrice,
    maxPrice,
    sortBy = "relevance",
    storeId,
    page = 1,
    limit = 8,
  } = filters;

  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: async (): Promise<{
      items: Product[];
      total: number;
      totalPages: number;
    }> => {
      // Simulate network latency
      await new Promise((r) => setTimeout(r, 300));

      let results = [...dummyProducts];

      // Filter by store
      if (storeId) results = results.filter((p) => p.storeId === storeId);

      // Search
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.storeName.toLowerCase().includes(q),
        );
      }

      // Price range
      if (minPrice !== undefined)
        results = results.filter((p) => p.price >= minPrice);
      if (maxPrice !== undefined)
        results = results.filter((p) => p.price <= maxPrice);

      // Sort
      if (sortBy === "price_asc") results.sort((a, b) => a.price - b.price);
      if (sortBy === "price_desc") results.sort((a, b) => b.price - a.price);
      if (sortBy === "rating") results.sort((a, b) => b.rating - a.rating);

      // Paginate
      const total = results.length;
      const totalPages = Math.ceil(total / limit);
      const items = results.slice((page - 1) * limit, page * limit);

      return { items, total, totalPages };
    },
    staleTime: 5 * 60 * 1000, // 5 min — product list doesn't change often
  });
}

// ── useProduct ─────────────────────────────────────────────
// Returns a single product by ID.
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: async (): Promise<Product> => {
      await new Promise((r) => setTimeout(r, 200));
      const product = dummyProducts.find((p) => p.id === id);
      if (!product) throw new Error("Produk tidak ditemukan");
      return product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
