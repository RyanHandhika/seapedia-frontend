import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@components/ui/Button/Button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <ShieldOff size={64} className="text-red-300 mb-6" />
      <h1 className="text-2xl font-bold font-display text-slate-800 mb-2">
        Akses Ditolak
      </h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        Kamu tidak memiliki akses ke halaman ini dengan peran aktif saat ini.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link to="/role-select">Ganti Peran</Link>
        </Button>
        <Button asChild>
          <Link to="/">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
