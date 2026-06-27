import type { Role } from "@/types";

export interface NavItem {
  to: string;
  label: string;
  icon: string; // inline svg path data (24x24 viewBox)
}

// Minimal inline icon paths (stroke-based, 24x24) so we ship zero icon deps.
export const ICONS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  bag: "M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0",
  box: "M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10",
  truck: "M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 18a2 2 0 1 0 0 .01M17 18a2 2 0 1 0 0 .01",
  wallet: "M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l3-3h11v3M17 13h.01",
  ticket: "M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z",
  pin: "M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11zM12 10a2 2 0 1 0 0 .01",
  list: "M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0",
  store: "M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6",
  chart: "M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6 6l1.5 1.5M16.5 16.5L18 18M18 6l-1.5 1.5M7.5 16.5L6 18",
} as const;

const buyerNav: NavItem[] = [
  { to: "/buyer/dashboard", label: "Dashboard", icon: ICONS.grid },
  { to: "/buyer/products", label: "Browse", icon: ICONS.bag },
  { to: "/buyer/orders", label: "My Orders", icon: ICONS.list },
  { to: "/buyer/wallet", label: "Wallet", icon: ICONS.wallet },
  { to: "/buyer/addresses", label: "Addresses", icon: ICONS.pin },
  { to: "/buyer/profile", label: "Profile", icon: ICONS.user },
];

const sellerNav: NavItem[] = [
  { to: "/seller/dashboard", label: "Dashboard", icon: ICONS.grid },
  { to: "/seller/products", label: "Products", icon: ICONS.box },
  { to: "/seller/orders", label: "Orders", icon: ICONS.list },
  { to: "/seller/store", label: "Store", icon: ICONS.store },
  { to: "/seller/analytics", label: "Income", icon: ICONS.chart },
];

const driverNav: NavItem[] = [
  { to: "/driver/dashboard", label: "Dashboard", icon: ICONS.grid },
  { to: "/driver/jobs", label: "Available Jobs", icon: ICONS.box },
  { to: "/driver/history", label: "History", icon: ICONS.clock },
  { to: "/driver/earnings", label: "Earnings", icon: ICONS.wallet },
];

const adminNav: NavItem[] = [
  { to: "/admin/dashboard", label: "Overview", icon: ICONS.grid },
  { to: "/admin/users", label: "Users", icon: ICONS.user },
  { to: "/admin/stores", label: "Stores", icon: ICONS.store },
  { to: "/admin/orders", label: "Orders", icon: ICONS.list },
  { to: "/admin/delivery-jobs", label: "Deliveries", icon: ICONS.truck },
  { to: "/admin/vouchers", label: "Vouchers", icon: ICONS.ticket },
  { to: "/admin/promos", label: "Promos", icon: ICONS.ticket },
  { to: "/admin/system", label: "System", icon: ICONS.gear },
];

export const ROLE_NAV: Record<Role, NavItem[]> = {
  BUYER: buyerNav,
  SELLER: sellerNav,
  DRIVER: driverNav,
  ADMIN: adminNav,
};
