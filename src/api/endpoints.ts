// ═══════════════════════════════════════════════════════════
// src/api/endpoints.ts
//
// Centralised list of every API URL.
//
// WHY CONSTANTS INSTEAD OF INLINE STRINGS?
// If the backend renames /auth/login to /auth/signin, you
// change it in ONE place here — not in 10 different files.
// ═══════════════════════════════════════════════════════════

export const ENDPOINTS = {
  // ── AUTH ──────────────────────────────────────────────────
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me", // Returns current user profile
  },

  // ── ROLE UPGRADE ──────────────────────────────────────────
  // Every account starts as BUYER only. These let an already-logged-in
  // user acquire an additional role without creating a new account.
  ROLE_UPGRADE: {
    BECOME_SELLER: "/users/me/become-seller", // POST { storeName }
    BECOME_DRIVER: "/users/me/become-driver", // POST { vehicleType, licenseNumber, phoneNumber }
  },

  // ── PRODUCTS (public + seller) ────────────────────────────
  PRODUCTS: {
    LIST: "/products", // GET  — public
    DETAIL: (id: string) => `/products/${id}`, // GET  — public
    CREATE: "/products", // POST — seller only
    UPDATE: (id: string) => `/products/${id}`, // PUT  — seller only
    DELETE: (id: string) => `/products/${id}`, // DEL  — seller only
    BY_STORE: (id: string) => `/stores/${id}/products`, // GET — public
  },

  // ── STORES ────────────────────────────────────────────────
  STORES: {
    MY_STORE: "/stores/me",
    CREATE: "/stores",
    UPDATE: (id: string) => `/stores/${id}`,
    PUBLIC: (id: string) => `/stores/${id}`,
  },

  // ── REVIEWS (app-level reviews, not product reviews) ──────
  REVIEWS: {
    LIST: "/reviews",
    CREATE: "/reviews",
  },

  // ── WALLET (buyer only) ───────────────────────────────────
  WALLET: {
    BALANCE: "/wallet/balance",
    TOP_UP: "/wallet/topup",
    TRANSACTIONS: "/wallet/transactions",
  },

  // ── CART (buyer only) ─────────────────────────────────────
  CART: {
    GET: "/cart",
    ADD: "/cart/items",
    UPDATE: (itemId: string) => `/cart/items/${itemId}`,
    REMOVE: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: "/cart/clear",
  },

  // ── ORDERS ────────────────────────────────────────────────
  ORDERS: {
    CHECKOUT: "/orders",
    BUYER_LIST: "/orders/buyer",
    BUYER_DETAIL: (id: string) => `/orders/buyer/${id}`,
    SELLER_LIST: "/orders/seller",
    SELLER_DETAIL: (id: string) => `/orders/seller/${id}`,
    PROCESS: (id: string) => `/orders/${id}/process`, // Seller action
  },

  // ── DELIVERY / DRIVER ─────────────────────────────────────
  DELIVERY: {
    AVAILABLE_JOBS: "/deliveries/available",
    JOB_DETAIL: (id: string) => `/deliveries/${id}`,
    TAKE_JOB: (id: string) => `/deliveries/${id}/take`,
    COMPLETE: (id: string) => `/deliveries/${id}/complete`,
    HISTORY: "/deliveries/history",
    EARNINGS: "/deliveries/earnings",
  },

  // ── DISCOUNTS ─────────────────────────────────────────────
  VOUCHERS: {
    LIST: "/vouchers",
    DETAIL: (id: string) => `/vouchers/${id}`,
    CREATE: "/vouchers", // Admin only
    VALIDATE: "/vouchers/validate",
  },
  PROMOS: {
    LIST: "/promos",
    DETAIL: (id: string) => `/promos/${id}`,
    CREATE: "/promos", // Admin only
    VALIDATE: "/promos/validate",
  },

  // ── ADMIN ─────────────────────────────────────────────────
  ADMIN: {
    STATS: "/admin/stats",
    USERS: "/admin/users",
    STORES: "/admin/stores",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    DELIVERIES: "/admin/deliveries",
    OVERDUE: "/admin/overdue",
    ADVANCE_DAY: "/admin/advance-day",
  },
} as const;
