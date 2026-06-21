import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <span className="text-xl font-extrabold font-display bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            SEAPEDIA
          </span>
          <p className="mt-3 text-sm leading-relaxed">
            Platform marketplace multi-penjual terpercaya untuk Indonesia.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Marketplace</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/products"
                className="hover:text-white transition-colors"
              >
                Produk
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="hover:text-white transition-colors"
              >
                Ulasan
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Jadi Penjual
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Akun</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-white transition-colors">
                Masuk
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Daftar
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">COMPFEST 18</h4>
          <p className="text-sm">Software Engineering Academy</p>
          <p className="text-sm mt-1">Universitas Indonesia</p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs">
        © 2025 SEAPEDIA. All rights reserved.
      </div>
    </footer>
  );
}
