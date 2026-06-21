// src/features/auth/components/RoleSelector.tsx
//
// Shown after login when a user owns more than one non-admin role.
// Displays a card for each owned role — user picks one to continue.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Store, Truck, ArrowRight } from "lucide-react";
import { useAuthStore } from "@stores/authStore";
import { ROLE_LABELS, ROLE_DASHBOARD } from "@types";
import type { Role } from "@types";
import { Button } from "@components/ui/Button/Button";
import { cn } from "@utils/cn";

const ROLE_META: Record<
  string,
  { icon: React.ElementType; description: string; color: string; bg: string }
> = {
  BUYER: {
    icon: ShoppingBag,
    description: "Belanja, kelola keranjang dan pesanan",
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  SELLER: {
    icon: Store,
    description: "Kelola toko, produk, dan pesanan masuk",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  DRIVER: {
    icon: Truck,
    description: "Cari dan selesaikan job pengiriman",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
};

const BORDER_SELECTED: Record<string, string> = {
  BUYER: "border-teal-500   ring-teal-100",
  SELLER: "border-amber-500  ring-amber-100",
  DRIVER: "border-blue-500   ring-blue-100",
};

export function RoleSelector() {
  const navigate = useNavigate();
  const roles = useAuthStore((s) => s.roles);
  const setActiveRole = useAuthStore((s) => s.setActiveRole);

  // Non-admin roles only (admin skips this page entirely)
  const selectableRoles = roles.filter((r) => r !== "ADMIN") as Role[];

  const [selected, setSelected] = useState<Role | null>(
    selectableRoles.length === 1 ? selectableRoles[0] : null,
  );

  const handleContinue = () => {
    if (!selected) return;
    setActiveRole(selected);
    navigate(ROLE_DASHBOARD[selected]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h1 className="text-2xl font-bold font-display text-slate-800 mb-1">
        Pilih Peran
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Kamu memiliki beberapa peran. Pilih peran untuk sesi ini.
      </p>

      <div className="space-y-3 mb-6">
        {selectableRoles.map((role) => {
          const { icon: Icon, description, color, bg } = ROLE_META[role];
          const isSelected = selected === role;

          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? cn("ring-2 ring-offset-1", BORDER_SELECTED[role])
                  : "border-slate-200 hover:border-slate-300",
              )}
            >
              <div className={cn("p-2.5 rounded-xl", bg)}>
                <Icon size={22} className={color} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {ROLE_LABELS[role]}
                </p>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
              {isSelected && <span className="text-xl">✓</span>}
            </button>
          );
        })}
      </div>

      <Button
        fullWidth
        disabled={!selected}
        onClick={handleContinue}
        rightIcon={<ArrowRight size={16} />}
      >
        Lanjutkan sebagai {selected ? ROLE_LABELS[selected] : "..."}
      </Button>
    </div>
  );
}
