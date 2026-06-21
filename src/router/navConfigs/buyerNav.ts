// src/router/navConfigs/buyerNav.ts
import {
  Home,
  Wallet,
  MapPin,
  ShoppingCart,
  ClipboardList,
} from "lucide-react";
import type { NavItem } from "@components/layouts/Sidebar/Sidebar";

export const buyerNav: NavItem[] = [
  { to: "/buyer", icon: Home, label: "Dashboard" },
  { to: "/buyer/wallet", icon: Wallet, label: "Dompet" },
  { to: "/buyer/addresses", icon: MapPin, label: "Alamat" },
  { to: "/buyer/cart", icon: ShoppingCart, label: "Keranjang" },
  { to: "/buyer/orders", icon: ClipboardList, label: "Pesanan Saya" },
];
