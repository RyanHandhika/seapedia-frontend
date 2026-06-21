import { Truck, ClipboardList, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { Card, CardHeader, CardBody } from "@components/ui/Card/Card";

export default function DriverDashboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800">
          Dashboard Pengirim
        </h1>
        <p className="text-slate-500 mt-1">
          Halo, {user?.username}! Cari dan selesaikan job pengiriman.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm mb-1">Penghasilan Hari Ini</p>
            <p className="text-3xl font-extrabold font-display">Rp 0</p>
            <p className="text-blue-200 text-xs mt-1">
              Selesaikan job untuk mulai menghasilkan
            </p>
          </div>
          <Wallet size={40} className="text-white/30" />
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Job Aktif", value: "0", icon: Truck },
          { label: "Selesai", value: "0", icon: ClipboardList },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <Icon size={20} className="text-blue-500 mb-2" />
            <p className="text-2xl font-bold font-display text-slate-800">
              {value}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>Tidak Ada Job Aktif</CardHeader>
        <CardBody>
          <div className="py-8 text-center">
            <Truck size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">
              Belum ada job aktif saat ini.
            </p>
            <Link
              to="/driver/jobs"
              className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Cari pekerjaan tersedia →
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
