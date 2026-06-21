import { Link } from "react-router-dom";
import {
  Users,
  Store,
  Package,
  ClipboardList,
  Truck,
  AlertTriangle,
  Tag,
  Megaphone,
} from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Card, CardHeader, CardBody } from "@components/ui/Card/Card";
import { Alert } from "@components/ui/Alert/Alert";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // All zero placeholders — real monitoring data is wired in Level 6
  const stats = [
    { label: "Total Users", value: "0", icon: Users, to: "/admin/users" },
    { label: "Total Toko", value: "0", icon: Store, to: "/admin/stores" },
    { label: "Total Produk", value: "0", icon: Package, to: "/admin/products" },
    {
      label: "Total Orders",
      value: "0",
      icon: ClipboardList,
      to: "/admin/orders",
    },
    { label: "Deliveries", value: "0", icon: Truck, to: "/admin/deliveries" },
    { label: "Overdue", value: "0", icon: AlertTriangle, to: "/admin/overdue" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800">
          Admin Panel — SEAPEDIA
        </h1>
        <p className="text-slate-500 mt-1">
          Halo, {user?.username}. Pantau dan kelola seluruh marketplace.
        </p>
      </div>

      <Alert type="info" title="Data Monitoring">
        Data monitoring lengkap akan tersedia di <strong>Level 6</strong>. Saat
        ini menampilkan struktur halaman.
      </Alert>

      {/* Monitoring stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card hoverable>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-slate-800">
                    {value}
                  </p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick nav: discounts */}
      <Card>
        <CardHeader>Kelola Diskon</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/vouchers"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <Tag size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-slate-700">
                Kelola Voucher
              </span>
            </Link>
            <Link
              to="/admin/promos"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <Megaphone size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-slate-700">
                Kelola Promo
              </span>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Admin setup note */}
      <Card className="bg-slate-50 border-dashed">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-700">Catatan:</strong> Akun Admin dibuat
          melalui seed data. Lihat{" "}
          <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">
            README.md
          </code>{" "}
          untuk instruksi setup akun admin.
        </p>
      </Card>
    </div>
  );
}
