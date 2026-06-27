import {
  useMutation, useQuery, useQueryClient,
} from "@tanstack/react-query";
import { sellerApi } from "@/api/seller";
import { qk } from "@/lib/queryClient";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";

export function useSellerStore() {
  return useQuery({ queryKey: qk.sellerStore, queryFn: sellerApi.getStore, retry: false });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sellerApi.updateStore,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.sellerStore });
      toast.success("Store updated");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Update failed"),
  });
}

export function useSellerProducts(params: { page?: number; search?: string }) {
  return useQuery({
    queryKey: qk.sellerProducts(params),
    queryFn: () => sellerApi.listProducts(params),
  });
}

export function useSellerProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["seller-product", id],
    queryFn: () => sellerApi.getProduct(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => sellerApi.createProduct(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product created");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Create failed"),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) => sellerApi.updateProduct(id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      qc.invalidateQueries({ queryKey: ["seller-product"] });
      toast.success("Product updated");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Update failed"),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerApi.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      toast.success("Product deleted");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Delete failed"),
  });
}

export function useSellerOrders(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: qk.sellerOrders(params),
    queryFn: () => sellerApi.listOrders(params),
  });
}

export function useSellerOrder(id: string | undefined) {
  return useQuery({
    queryKey: qk.sellerOrder(id ?? ""),
    queryFn: () => sellerApi.getOrder(id!),
    enabled: !!id,
  });
}

export function useProcessOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sellerApi.processOrder(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
      qc.invalidateQueries({ queryKey: ["seller-order"] });
      toast.success("Order processed — a delivery job is now available to drivers.");
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Could not process order"),
  });
}

export function useIncomeReport() {
  return useQuery({ queryKey: ["seller-income"], queryFn: sellerApi.incomeReport });
}
