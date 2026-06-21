// src/router/navConfigs/sellerNav.ts
import { Home, Store, Package, ClipboardList, BarChart2 } from "lucide-react";
import type { NavItem } from "@components/layouts/Sidebar/Sidebar";

export const sellerNav: NavItem[] = [
  { to: "/seller", icon: Home, label: "Dashboard" },
  { to: "/seller/store", icon: Store, label: "Toko Saya" },
  { to: "/seller/products", icon: Package, label: "Produk" },
  { to: "/seller/orders", icon: ClipboardList, label: "Pesanan Masuk" },
  { to: "/seller/income", icon: BarChart2, label: "Laporan" },
];
