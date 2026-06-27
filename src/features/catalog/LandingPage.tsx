import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { useProducts } from "./hooks";

export function LandingPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useProducts({ page: 1, limit: 8 });

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" /> Same-day delivery available
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              The freshest market,<br />
              <span className="text-brand-300">delivered to your door.</span>
            </h1>
            <p className="mt-4 max-w-md text-ink-300">
              Buy from local stores, open your own shop, or earn as a driver —
              all from one account. Wallet payments, transparent pricing, real-time tracking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/products")}>Start shopping</Button>
              <Button
                size="lg"
                variant="secondary"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => navigate("/auth/register")}
              >
                Open a store
              </Button>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                ["≤3h", "Instant delivery"],
                ["12%", "PPN handled"],
                ["4-in-1", "Roles per account"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-bold text-brand-300">{n}</p>
                  <p className="text-sm text-ink-400">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — layered marine waves */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 grid place-items-center">
              <svg viewBox="0 0 400 400" className="w-full max-w-md">
                <defs>
                  <linearGradient id="h1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2fb6a8" />
                    <stop offset="100%" stopColor="#0c6566" />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="150" fill="url(#h1)" opacity="0.25" />
                <circle cx="200" cy="200" r="110" fill="url(#h1)" opacity="0.4" />
                <path d="M70 220 Q130 170 200 220 T330 220" stroke="#5bd1c3" strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M70 250 Q130 200 200 250 T330 250" stroke="#94e5da" strokeWidth="3" fill="none" opacity="0.5" />
                <path d="M150 150c30-20 70-15 90 5 0 0-15 35-55 45-35 9-65-15-75-30z" fill="#fb6a42" opacity="0.85" />
                <path d="M232 158l25-18-5 28z" fill="#fb6a42" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 80" className="block w-full" preserveAspectRatio="none" aria-hidden>
          <path d="M0 40 Q360 0 720 40 T1440 40 V80 H0Z" className="fill-foam" />
        </svg>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {["All", "Fresh catch", "Frozen", "Shellfish", "Dried", "Ready-to-cook"].map((c) => (
            <Link
              key={c}
              to="/products"
              className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">Trending now</h2>
            <p className="text-sm text-ink-500">Fresh listings from active stores.</p>
          </div>
          <Button variant="tertiary" onClick={() => navigate("/products")}>View all →</Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.data.map((p) => (
                <ProductCard key={p.id} product={p} to={`/products/${p.id}`} />
              ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section id="why" className="border-t border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-3 lg:px-8">
          {[
            ["Fresh from sellers", "Buy directly from local stores with transparent stock."],
            ["Wallet-first checkout", "Top up once, pay instantly. PPN and delivery fees shown upfront."],
            ["Track every step", "From packing to your door — follow each order in real time."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-ink-100 p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">✓</div>
              <h3 className="mt-3 font-display font-semibold text-ink-900">{t}</h3>
              <p className="mt-1 text-sm text-ink-500">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
