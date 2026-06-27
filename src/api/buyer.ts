import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type {
  Address,
  Cart,
  CheckoutTotals,
  DiscountValidation,
  Order,
  Paginated,
  WalletBalance,
  WalletTransaction,
  DeliveryMethod,
} from "@/types";

export const buyerApi = {
  // Wallet
  getWallet: () => apiGet<WalletBalance>("/buyer/wallet"),
  topup: (amount: number) =>
    apiPost<{ balance: number }>("/buyer/wallet/topup", { amount }),
  listTransactions: (page = 1, limit = 10) =>
    apiGet<Paginated<WalletTransaction>>("/buyer/wallet/transactions", {
      page,
      limit,
    }),

  // Addresses
  listAddresses: () => apiGet<Address[]>("/buyer/addresses"),
  createAddress: (body: Omit<Address, "id" | "buyerId">) =>
    apiPost<Address>("/buyer/addresses", body),
  updateAddress: (id: string, body: Partial<Address>) =>
    apiPut<Address>(`/buyer/addresses/${id}`, body),
  deleteAddress: (id: string) =>
    apiDelete<{ message: string }>(`/buyer/addresses/${id}`),

  // Cart
  getCart: () => apiGet<Cart>("/buyer/cart"),
  addToCart: (productId: string, quantity: number) =>
    apiPost<Cart>("/buyer/cart/items", { productId, quantity }),
  updateCartItem: (productId: string, quantity: number) =>
    apiPut<Cart>(`/buyer/cart/items/${productId}`, { quantity }),
  removeCartItem: (productId: string) =>
    apiDelete<Cart>(`/buyer/cart/items/${productId}`),
  clearCart: () => apiDelete<{ message: string }>("/buyer/cart"),

  // Checkout & orders
  previewCheckout: (body: {
    addressId: string;
    deliveryMethod: DeliveryMethod;
    discountCode?: string;
  }) => apiPost<CheckoutTotals>("/buyer/checkout/preview", body),
  checkout: (body: {
    addressId: string;
    deliveryMethod: DeliveryMethod;
    discountCode?: string;
  }) => apiPost<Order>("/buyer/checkout", body),

  listOrders: (params: { page?: number; limit?: number; status?: string } = {}) =>
    apiGet<Paginated<Order>>("/buyer/orders", params),
  getOrder: (id: string) => apiGet<Order>(`/buyer/orders/${id}`),
  spendingReport: () => apiGet<unknown>("/buyer/reports/spending"),

  validateDiscount: (code: string, subtotal: number) =>
    apiGet<DiscountValidation>("/buyer/discounts/validate", { code, subtotal }),
};
