import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buyerApi } from "@/api/buyer";
import { qk } from "@/lib/queryClient";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "@/stores/toastStore";
import { ApiException } from "@/api/client";
import type { Cart, DeliveryMethod } from "@/types";

// Keeps the Zustand cart mirror in sync after any cart query/mutation.
function syncCart(cart: Cart) {
  useCartStore.getState().setCart(cart);
}

export function useCart(enabled = true) {
  return useQuery({
    queryKey: qk.cart,
    queryFn: async () => {
      const cart = await buyerApi.getCart();
      syncCart(cart);
      return cart;
    },
    enabled,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => buyerApi.addToCart(productId, quantity),
    onSuccess: (cart) => {
      syncCart(cart);
      qc.setQueryData(qk.cart, cart);
      toast.success("Added to cart");
    },
    onError: (e) =>
      toast.error(
        e instanceof ApiException ? e.message : "Could not add to cart",
      ),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => buyerApi.updateCartItem(productId, quantity),
    onSuccess: (cart) => {
      syncCart(cart);
      qc.setQueryData(qk.cart, cart);
    },
    onError: (e) =>
      toast.error(e instanceof ApiException ? e.message : "Update failed"),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => buyerApi.removeCartItem(productId),
    onSuccess: (cart) => {
      syncCart(cart);
      qc.setQueryData(qk.cart, cart);
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => buyerApi.clearCart(),
    onSuccess: () => {
      useCartStore.getState().clear();
      qc.invalidateQueries({ queryKey: qk.cart });
    },
  });
}

// ── Wallet ──
export function useWallet() {
  return useQuery({ queryKey: qk.wallet, queryFn: buyerApi.getWallet });
}
export function useWalletTransactions(page: number) {
  return useQuery({
    queryKey: qk.walletTx(page),
    queryFn: () => buyerApi.listTransactions(page),
  });
}
export function useTopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => buyerApi.topup(amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.wallet });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
      toast.success("Top-up successful");
    },
    onError: (e) =>
      toast.error(e instanceof ApiException ? e.message : "Top-up failed"),
  });
}

// ── Addresses ──
export function useAddresses() {
  return useQuery({ queryKey: qk.addresses, queryFn: buyerApi.listAddresses });
}
export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: buyerApi.createAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.addresses });
      toast.success("Address saved");
    },
    onError: (e) =>
      toast.error(
        e instanceof ApiException && e.code === "BAD_REQUEST"
          ? "Please fill in all fields with valid details."
          : e instanceof ApiException
            ? e.message
            : "Could not save address",
      ),
  });
}
export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => buyerApi.deleteAddress(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.addresses });
      toast.success("Address removed");
    },
    onError: (e) =>
      toast.error(e instanceof ApiException ? e.message : "Could not remove"),
  });
}

// ── Orders ──
export function useBuyerOrders(params: { page?: number; status?: string }) {
  return useQuery({
    queryKey: qk.buyerOrders(params),
    queryFn: () => buyerApi.listOrders(params),
  });
}
export function useBuyerOrder(id: string | undefined) {
  return useQuery({
    queryKey: qk.buyerOrder(id ?? ""),
    queryFn: () => buyerApi.getOrder(id!),
    enabled: !!id,
  });
}

// ── Checkout ──
export function useCheckoutPreview() {
  return useMutation({
    mutationFn: (body: {
      addressId: string;
      deliveryMethod: DeliveryMethod;
      discountCode?: string;
    }) => buyerApi.previewCheckout(body),
  });
}
export function useConfirmCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      addressId: string;
      deliveryMethod: DeliveryMethod;
      discountCode?: string;
    }) => buyerApi.checkout(body),
    onSuccess: () => {
      useCartStore.getState().clear();
      qc.invalidateQueries({ queryKey: qk.cart });
      qc.invalidateQueries({ queryKey: qk.wallet });
      qc.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
  });
}
