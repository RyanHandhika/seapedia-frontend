// ═══════════════════════════════════════════════════════════
// src/stores/uiStore.ts
//
// Manages global UI state: toasts, sidebar, page loading.
// No persistence needed — this is ephemeral (resets on refresh).
// ═══════════════════════════════════════════════════════════

import { create } from "zustand";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number; // ms before auto-dismiss (default: 4000)
}

interface UIState {
  // ── TOAST NOTIFICATIONS ───────────────────────────────────
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  // ── SIDEBAR ────────────────────────────────────────────────
  // Controls whether the sidebar is open on mobile
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  // ── PAGE LOADING ───────────────────────────────────────────
  // Shown as a full-screen spinner while the app initializes
  isPageLoading: boolean;
  setPageLoading: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  sidebarOpen: false,
  isPageLoading: true, // Start as loading until auth is initialized

  addToast: (toast) => {
    const id = crypto.randomUUID(); // Unique ID for each toast
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setPageLoading: (v) => set({ isPageLoading: v }),
}));

// ═══════════════════════════════════════════════════════════
// src/stores/cartStore.ts
//
// Manages cart metadata for the single-store enforcement rule.
//
// WHY A SEPARATE STORE?
// The actual cart ITEMS live in TanStack Query cache (server state).
// But we need to check the current store instantly — before making
// an API call — to show the conflict warning immediately.
//
// So cartStore holds METADATA ONLY:
//   - Which store's products are in the cart right now?
//   - How many items? (for the badge on the cart icon)
// ═══════════════════════════════════════════════════════════

import { persist as zustandPersist } from "zustand/middleware";

interface CartState {
  // The storeId of products currently in the cart.
  // null = cart is empty.
  currentStoreId: string | null;

  // Item count for the navbar cart badge
  itemCount: number;

  setCartStore: (storeId: string) => void;
  setItemCount: (count: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  zustandPersist(
    (set) => ({
      currentStoreId: null,
      itemCount: 0,

      setCartStore: (storeId) => set({ currentStoreId: storeId }),
      setItemCount: (count) => set({ itemCount: count }),
      clearCart: () => set({ currentStoreId: null, itemCount: 0 }),
    }),
    {
      name: "seapedia-cart-meta",
      // Only persist the storeId — not the count (re-fetched from server)
      partialize: (state) => ({ currentStoreId: state.currentStoreId }),
    },
  ),
);
