import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "@components/ui/Button/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <FileQuestion size={64} className="text-slate-300 mb-6" />
      <h1 className="text-4xl font-bold font-display text-slate-800 mb-2">
        404
      </h1>
      <p className="text-slate-500 mb-8">
        Halaman yang kamu cari tidak ditemukan.
      </p>
      <Button asChild>
        <Link to="/">← Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
