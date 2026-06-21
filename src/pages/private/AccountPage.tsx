import { ProfileSummaryCard } from "@features/auth/components/ProfileSummaryCard";
import { RoleUpgradeCard } from "@features/auth/components/RoleUpgradeCard";
import { Card, CardHeader, CardBody } from "@components/ui/Card/Card";
import { formatRupiah } from "@utils/currency";
import { useAuth } from "@hooks/useAuth";
import type { Role } from "@types";

export default function AccountPage() {
  const { roles } = useAuth();
  const r = roles as Role[];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800">
          Akun Saya
        </h1>
        <p className="text-slate-500 mt-1">
          Kelola profil dan upgrade peran akunmu.
        </p>
      </div>

      <ProfileSummaryCard />

      {/* Financial summary across all owned roles */}
      <Card>
        <CardHeader>Ringkasan Keuangan</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-teal-50">
              <p className="text-xs text-teal-600 font-medium mb-1">
                Saldo Dompet (Pembeli)
              </p>
              <p className="text-lg font-bold text-teal-700">
                {formatRupiah(0)}
              </p>
            </div>
            {r.includes("SELLER") && (
              <div className="p-3 rounded-xl bg-amber-50">
                <p className="text-xs text-amber-600 font-medium mb-1">
                  Pendapatan (Penjual)
                </p>
                <p className="text-lg font-bold text-amber-700">
                  {formatRupiah(0)}
                </p>
              </div>
            )}
            {r.includes("DRIVER") && (
              <div className="p-3 rounded-xl bg-blue-50">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Penghasilan (Pengirim)
                </p>
                <p className="text-lg font-bold text-blue-700">
                  {formatRupiah(0)}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Role upgrade section */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-1">
          Upgrade Akun
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Tambah peran baru tanpa perlu membuat akun baru. Kamu bisa berganti
          antar peran kapan saja.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RoleUpgradeCard role="SELLER" />
          <RoleUpgradeCard role="DRIVER" />
        </div>
      </div>
    </div>
  );
}
