// src/router/navConfigs/adminNav.ts
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ClipboardList,
  Truck,
  AlertTriangle,
  Tag,
  Megaphone,
} from "lucide-react";
import type { NavItem } from "@components/layouts/Sidebar/Sidebar";

export const adminNav: NavItem[] = [
  { to: "/admin", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/stores", icon: Store, label: "Toko" },
  { to: "/admin/products", icon: Package, label: "Produk" },
  { to: "/admin/orders", icon: ClipboardList, label: "Pesanan" },
  { to: "/admin/deliveries", icon: Truck, label: "Pengiriman" },
  { to: "/admin/overdue", icon: AlertTriangle, label: "Overdue" },
  { to: "/admin/vouchers", icon: Tag, label: "Voucher" },
  { to: "/admin/promos", icon: Megaphone, label: "Promo" },
];
