// src/router/navConfigs/driverNav.ts
import { Home, Search, Truck, ClipboardList, Wallet } from "lucide-react";
import type { NavItem } from "@components/layouts/Sidebar/Sidebar";

export const driverNav: NavItem[] = [
  { to: "/driver", icon: Home, label: "Dashboard" },
  { to: "/driver/jobs", icon: Search, label: "Cari Pekerjaan" },
  { to: "/driver/active", icon: Truck, label: "Job Aktif" },
  { to: "/driver/history", icon: ClipboardList, label: "Riwayat Job" },
  { to: "/driver/earnings", icon: Wallet, label: "Penghasilan" },
];
