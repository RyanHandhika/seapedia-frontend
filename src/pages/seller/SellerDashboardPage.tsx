import { Link } from "react-router-dom";
import { Store, Package, ClipboardList, BarChart2 } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Card, CardHeader, CardBody } from "@components/ui/Card/Card";
import { Alert } from "@components/ui/Alert/Alert";

export default function SellerDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Total Produk", value: "0", icon: Package, color: "amber" },
    { label: "Pesanan Masuk", value: "0", icon: ClipboardList, color: "blue" },
    { label: "Pendapatan", value: "Rp 0", icon: BarChart2, color: "green" },
  ];

  const bgMap: Record<string, string> = {
    amber: "bg-amber-50",
    blue: "bg-blue-50",
    green: "bg-green-50",
  };
  const iconMap: Record<string, string> = {
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800">
          Dashboard Penjual
        </h1>
        <p className="text-slate-500 mt-1">
          Halo, {user?.username}! Kelola toko dan produkmu di sini.
        </p>
      </div>

      {/* Store setup prompt */}
      <Alert type="info" title="Buat toko kamu dulu!">
        Kamu belum punya toko. Buat toko untuk mulai menjual produk.{" "}
        <Link to="/seller/store/create" className="font-semibold underline">
          Buat Toko Sekarang →
        </Link>
      </Alert>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center shrink-0`}
              >
                <Icon size={22} className={iconMap[color]} />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-slate-800">
                  {value}
                </p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick nav */}
      <Card>
        <CardHeader>Mulai Dari Sini</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: "/seller/store/create", icon: Store, label: "Buat Toko" },
              { to: "/seller/products", icon: Package, label: "Kelola Produk" },
              {
                to: "/seller/orders",
                icon: ClipboardList,
                label: "Pesanan Masuk",
              },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
              >
                <Icon size={18} className="text-amber-600" />
                <span className="text-sm font-medium text-slate-700">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
