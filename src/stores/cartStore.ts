import { create } from "zustand";
import type { Cart } from "@/types";

// The cart is server-authoritative (single-store rule + stock checks live in
// the backend). This store mirrors the latest server snapshot so the navbar
// badge and cart drawer stay in sync without re-fetching everywhere.
interface CartState {
  cart: Cart | null;
  count: number;
  setCart: (cart: Cart | null) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  count: 0,
  setCart: (cart) =>
    set({
      cart,
      count: cart?.cartItems.reduce((s, i) => s + i.quantity, 0) ?? 0,
    }),
  clear: () => set({ cart: null, count: 0 }),
}));
