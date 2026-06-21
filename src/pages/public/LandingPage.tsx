import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Store,
  Truck,
  ArrowRight,
  Shield,
  Zap,
  HeartHandshake,
} from "lucide-react";
import { ProductCard } from "@components/shared/ProductCard/ProductCard";
import { ProductCardSkeleton } from "@components/ui/Skeleton/Skeleton";
import { ReviewList } from "@features/review/components/ReviewList";
import { ReviewForm } from "@features/review/components/ReviewForm";
import { useReviews } from "@features/review/hooks/useReviews";
import { useProducts } from "@features/product/hooks/useProducts";
import { Button } from "@components/ui/Button/Button";
import { Card } from "@components/ui/Card/Card";

export default function LandingPage() {
  const { data: productData, isLoading: productsLoading } = useProducts({
    limit: 8,
  });
  const { reviews } = useReviews();

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 backdrop-blur-sm">
              🎉 Platform Marketplace #1 Indonesia
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold font-display leading-tight mb-4">
              Belanja Lebih Mudah,
              <br />
              <span className="text-teal-200">dari Penjual Terpercaya.</span>
            </h1>
            <p className="text-teal-100 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              SEAPEDIA menghubungkan pembeli, penjual, dan pengirim dalam satu
              ekosistem marketplace modern.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/products">
                  <ShoppingBag size={18} /> Mulai Belanja
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/register">
                  Jadi Penjual <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats cards floating on right */}
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm w-full">
            {[
              { label: "Produk", value: "10,000+", icon: ShoppingBag },
              { label: "Penjual", value: "2,500+", icon: Store },
              { label: "Pengirim", value: "500+", icon: Truck },
              { label: "Transaksi", value: "50K+", icon: Shield },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20"
              >
                <Icon size={24} className="mx-auto mb-2 text-teal-200" />
                <p className="text-2xl font-extrabold font-display">{value}</p>
                <p className="text-teal-200 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-slate-800 text-center mb-3">
            Cara Kerja SEAPEDIA
          </h2>
          <p className="text-slate-500 text-center mb-12">
            Belanja jadi semudah 3 langkah
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                step: "01",
                title: "Pilih Produk",
                desc: "Temukan produk dari ratusan penjual terpercaya dengan harga terbaik",
              },
              {
                icon: Zap,
                step: "02",
                title: "Bayar Aman",
                desc: "Bayar menggunakan saldo dompet digital SEAPEDIA yang aman",
              },
              {
                icon: HeartHandshake,
                step: "03",
                title: "Terima Pesanan",
                desc: "Pesanan diantar oleh driver profesional langsung ke pintumu",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                    <Icon size={28} className="text-teal-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-display text-slate-800">
                Produk Pilihan
              </h2>
              <p className="text-slate-500 mt-1">
                Pilihan terbaik dari penjual terpercaya
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : productData?.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* ── ROLE INTRO ──────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-slate-800 text-center mb-12">
            Siapa Kamu?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Pembeli",
                icon: ShoppingBag,
                color: "teal",
                desc: "Temukan produk favoritmu, bayar dengan saldo dompet, terima di rumah.",
                cta: "Mulai Belanja",
                href: "/products",
              },
              {
                role: "Penjual",
                icon: Store,
                color: "amber",
                desc: "Buka toko, upload produk, dan mulai hasilkan pendapatan dari rumah.",
                cta: "Buka Toko",
                href: "/register",
              },
              {
                role: "Pengirim",
                icon: Truck,
                color: "blue",
                desc: "Ambil job pengiriman, antar pesanan, dan dapatkan penghasilan fleksibel.",
                cta: "Daftar Driver",
                href: "/register",
              },
            ].map(({ role, icon: Icon, color, desc, cta, href }) => {
              const bgMap: Record<string, string> = {
                teal: "bg-teal-50",
                amber: "bg-amber-50",
                blue: "bg-blue-50",
              };
              const iconMap: Record<string, string> = {
                teal: "text-teal-600",
                amber: "text-amber-600",
                blue: "text-blue-600",
              };
              const btnVariant = color === "teal" ? "primary" : "secondary";
              return (
                <Card key={role} hoverable className="text-center p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl ${bgMap[color]} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon size={26} className={iconMap[color]} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-800 mb-3">
                    {role}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {desc}
                  </p>
                  <Button
                    variant={btnVariant as "primary" | "secondary"}
                    asChild
                  >
                    <Link to={href}>{cta}</Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── APP REVIEWS ─────────────────────────────────────── */}
      <section className="py-16 bg-slate-50" id="reviews">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display text-slate-800 mb-2">
              Apa Kata Pengguna Kami
            </h2>
            <p className="text-slate-500">
              Pengalaman nyata dari pengguna SEAPEDIA
            </p>
          </div>

          <ReviewList reviews={reviews} limit={3} />

          {/* Write a review */}
          <div className="max-w-xl mx-auto mt-12">
            <h3 className="text-lg font-semibold text-slate-800 text-center mb-6">
              Bagikan Pengalamanmu
            </h3>
            <Card>
              <ReviewForm />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
