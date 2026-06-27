// Domain types mirroring the SEAPEDIA backend (Prisma schema + API envelopes).

export type Role = "ADMIN" | "SELLER" | "BUYER" | "DRIVER";
export type SwitchableRole = "SELLER" | "BUYER" | "DRIVER";

export type DeliveryMethod = "INSTANT" | "NEXT_DAY" | "REGULAR";

export type OrderStatus =
  | "SEDANG_DIKEMAS"
  | "MENUNGGU_PENGIRIM"
  | "SEDANG_DIKIRIM"
  | "PESANAN_SELESAI"
  | "DIKEMBALIKAN";

export type DeliveryJobStatus = "AVAILABLE" | "TAKEN" | "COMPLETED";
export type WalletTransactionType = "TOPUP" | "PAYMENT" | "REFUND";
export type DiscountType = "VOUCHER" | "PROMO" | "NONE";
export type DiscountValueType = "PERCENT" | "FIXED";

// ── API envelope ─────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true;
  data: T;
}
export interface ApiError {
  success: false;
  code: string;
  message: string;
  errors?: unknown;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface SafeUser {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  activeRole?: Role;
}

export interface FullSession {
  requiresRoleSelection: false;
  roles: Role[];
  accessToken: string;
  refreshToken: string;
}
export interface PendingSession {
  requiresRoleSelection: true;
  roles: Role[];
  rolePendingToken: string;
}
export type LoginResult = FullSession | PendingSession;

export interface MeSummary {
  activeRole: Role;
  roles: Role[];
  buyer: { walletBalance: number } | null;
  seller: { storeName: string | null; storeIncome: number | null } | null;
  driver: { driverEarnings: number | null; note?: string } | null;
}

// ── Catalog / Product ────────────────────────────────────────────────────────
export interface StoreRef {
  id: string;
  storeName: string;
  description?: string | null;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store?: StoreRef;
}

export interface Store {
  id: string;
  sellerId: string;
  storeName: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}
export interface Cart {
  id: string;
  buyerId: string;
  storeId: string | null;
  cartItems: CartItem[];
  subtotal: number;
  store?: StoreRef | null;
}

// ── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  buyerId: string;
  label: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}

// ── Wallet ───────────────────────────────────────────────────────────────────
export interface WalletBalance {
  balance: number;
  walletId?: string;
}
export interface WalletTransaction {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: string | number;
  description?: string | null;
  createdAt: string;
}

// ── Discount ─────────────────────────────────────────────────────────────────
export interface DiscountValidation {
  valid: boolean;
  reason?: string;
  type?: "VOUCHER" | "PROMO";
  discountType?: DiscountValueType;
  value?: number;
  discountAmount?: number;
  remaining?: number;
  description?: string | null;
  expiryDate?: string;
}

export interface CheckoutTotals {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  ppnAmount: number;
  total: number;
  discountType: DiscountType;
  deliveryMethod: DeliveryMethod;
}

export interface Voucher {
  id: string;
  code: string;
  discountType: DiscountValueType;
  value: string | number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
}
export interface Promo {
  id: string;
  code: string;
  discountType: DiscountValueType;
  value: string | number;
  expiryDate: string;
  description?: string | null;
  createdAt: string;
}

// ── Order ────────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string | number;
  product?: Product;
}
export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  changedAt: string;
}
export interface Order {
  id: string;
  buyerId: string;
  storeId: string;
  addressId: string;
  subtotal: string | number;
  discountAmount: string | number;
  discountType: DiscountType;
  deliveryMethod: DeliveryMethod;
  deliveryFee: string | number;
  ppnAmount: string | number;
  total: string | number;
  status: OrderStatus;
  dueAt?: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  address?: Address;
  store?: StoreRef;
  buyer?: { id: string; username: string };
}

// ── Driver ───────────────────────────────────────────────────────────────────
export interface DeliveryJob {
  id: string;
  orderId: string;
  driverId: string | null;
  status: DeliveryJobStatus;
  takenAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  order?: Partial<Order> & {
    store?: StoreRef;
    address?: Address;
    buyer?: { id: string; username: string };
  };
}
export interface DriverEarnings {
  total?: number;
  count?: number;
  earnings?: Array<{ id: string; amount: string | number; createdAt: string }>;
}

// ── Admin ────────────────────────────────────────────────────────────────────
export interface AdminDashboard {
  users: number;
  stores: number;
  products: number;
  orders: number;
  vouchers: number;
  promos: number;
  deliveryJobs: number;
  overdueOrders: number;
  simulatedDate: string;
}
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  userRoles: { role: Role }[];
  createdAt: string;
}
