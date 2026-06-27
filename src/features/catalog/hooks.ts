import { useQuery } from "@tanstack/react-query";
import { catalogApi, type CatalogQuery } from "@/api/catalog";
import { qk } from "@/lib/queryClient";

export function useProducts(params: CatalogQuery) {
  return useQuery({
    queryKey: qk.catalog(params),
    queryFn: () => catalogApi.listProducts(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: qk.product(id ?? ""),
    queryFn: () => catalogApi.getProduct(id!),
    enabled: !!id,
  });
}

export function useStore(id: string | undefined) {
  return useQuery({
    queryKey: ["store", id],
    queryFn: () => catalogApi.getStore(id!),
    enabled: !!id,
  });
}
