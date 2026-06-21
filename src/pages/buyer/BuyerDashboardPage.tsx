import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Wallet,
  ShoppingCart,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Card, CardHeader, CardBody } from "@components/ui/Card/Card";
import { formatRupiah } from "@utils/currency";

export default function BuyerDashboardPage() {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: ShoppingBag,
      label: "Mulai Belanja",
      desc: "Temukan produk favoritmu",
      to: "/products",
      color: "teal",
    },
    {
      icon: Wallet,
      label: "Top Up Saldo",
      desc: "Isi saldo dompetmu",
      to: "/buyer/wallet/topup",
      color: "emerald",
    },
    {
      icon: ShoppingCart,
      label: "Keranjang",
      desc: "Lihat item di keranjang",
      to: "/buyer/cart",
      color: "blue",
    },
    {
      icon: ClipboardList,
      label: "Pesanan Saya",
      desc: "Lacak status pesananmu",
      to: "/buyer/orders",
      color: "amber",
    },
  ];

  const bgMap: Record<string, string> = {
    teal: "bg-teal-50",
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    amber: "bg-amber-50",
  };
  const iconMap: Record<string, string> = {
    teal: "text-teal-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    amber: "text-amber-600",
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800">
          Halo, {user?.username}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Selamat datang di dashboard pembeli kamu.
        </p>
      </div>

      {/* Balance card */}
      <Card className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm mb-1">Saldo Dompet</p>
            <p className="text-3xl font-extrabold font-display">
              {formatRupiah(0)}
            </p>
            <p className="text-teal-200 text-xs mt-1">
              Top up untuk mulai berbelanja
            </p>
          </div>
          <Wallet size={40} className="text-white/30" />
        </div>
        <div className="mt-4">
          <Link
            to="/buyer/wallet/topup"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Top Up Sekarang <ArrowRight size={14} />
          </Link>
        </div>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, desc, to, color }) => (
            <Link key={to} to={to}>
              <Card hoverable padding="md" className="h-full">
                <div
                  className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center mb-3`}
                >
                  <Icon size={20} className={iconMap[color]} />
                </div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders placeholder */}
      <Card>
        <CardHeader>Pesanan Terbaru</CardHeader>
        <CardBody>
          <div className="py-8 text-center">
            <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Belum ada pesanan.</p>
            <Link
              to="/products"
              className="text-teal-600 text-sm font-medium hover:underline mt-1 inline-block"
            >
              Yuk mulai belanja! →
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
