// src/features/auth/components/RoleUpgradeCard.tsx
//
// One card per upgradeable role (Seller, Driver). If the user
// already owns the role, shows a disabled "✓ Sudah Aktif" state
// instead of the upgrade button. Clicking the button opens a Modal
// containing the relevant registration form (BecomeSellerForm /
// BecomeDriverForm).

import React, { useState } from "react";
import { Store, Truck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Card } from "@components/ui/Card/Card";
import { Button } from "@components/ui/Button/Button";
import { Modal } from "@components/ui/Modal/Modal";
import { BecomeSellerForm } from "./BecomeSellerForm";
import { BecomeDriverForm } from "./BecomeDriverForm";
import type { Role } from "@types";

interface RoleUpgradeCardProps {
  role: "SELLER" | "DRIVER";
}

const META: Record<
  "SELLER" | "DRIVER",
  {
    icon: React.ElementType;
    title: string;
    desc: string;
    color: string;
    bg: string;
    cta: string;
    modalTitle: string;
  }
> = {
  SELLER: {
    icon: Store,
    title: "Jadi Penjual",
    desc: "Buka toko, jual produk, dan kelola pesanan dari pembeli di seluruh Indonesia.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    cta: "Jadi Penjual",
    modalTitle: "Buat Toko Kamu",
  },
  DRIVER: {
    icon: Truck,
    title: "Jadi Pengirim",
    desc: "Ambil job pengiriman fleksibel dan hasilkan pendapatan tambahan kapan saja.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    cta: "Jadi Pengirim",
    modalTitle: "Daftar Sebagai Pengirim",
  },
};

export function RoleUpgradeCard({ role }: RoleUpgradeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { roles } = useAuth();
  const alreadyOwned = (roles as Role[]).includes(role);
  const { icon: Icon, title, desc, color, bg, cta, modalTitle } = META[role];

  return (
    <>
      <Card className="flex flex-col h-full">
        <div
          className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-3`}
        >
          <Icon size={22} className={color} />
        </div>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 flex-1 mb-4">{desc}</p>

        {alreadyOwned ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-3 py-2">
            <CheckCircle2 size={16} /> Sudah Aktif
          </div>
        ) : (
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            {cta}
          </Button>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        size="sm"
      >
        {role === "SELLER" ? (
          <BecomeSellerForm onCancel={() => setModalOpen(false)} />
        ) : (
          <BecomeDriverForm onCancel={() => setModalOpen(false)} />
        )}
      </Modal>
    </>
  );
}
