import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { ReviewsSection } from "./ReviewsSection";
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
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />{" "}
              Same-day delivery available
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">
              The freshest market,
              <br />
              <span className="text-brand-300">delivered to your door.</span>
            </h1>
            <p className="mt-4 max-w-md text-ink-300">
              Shop fresh from local stores, pay instantly from your wallet, and
              track every order in real time — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate("/products")}>
                  Start shopping
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  onClick={() =>
                    document
                      .getElementById("why")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Why SEAPEDIA?
                </Button>
              </div>
            </div>
            <div className="mt-10 flex gap-8">
              {[
                ["≤3h", "Instant delivery"],
                ["12%", "PPN handled"],
                ["100%", "Transparent pricing"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl font-bold text-brand-300">
                    {n}
                  </p>
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
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="url(#h1)"
                  opacity="0.25"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="110"
                  fill="url(#h1)"
                  opacity="0.4"
                />
                <path
                  d="M70 220 Q130 170 200 220 T330 220"
                  stroke="#5bd1c3"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M70 250 Q130 200 200 250 T330 250"
                  stroke="#94e5da"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.5"
                />
                <path
                  d="M150 150c30-20 70-15 90 5 0 0-15 35-55 45-35 9-65-15-75-30z"
                  fill="#fb6a42"
                  opacity="0.85"
                />
                <path d="M232 158l25-18-5 28z" fill="#fb6a42" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 1440 80"
          className="block w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 40 Q360 0 720 40 T1440 40 V80 H0Z"
            className="fill-foam"
          />
        </svg>
      </section>

      {/* ── Trending ── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Trending now
            </h2>
            <p className="text-sm text-ink-500">
              Fresh listings from active stores.
            </p>
          </div>
          <Button variant="tertiary" onClick={() => navigate("/products")}>
            View all →
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : data?.data.map((p) => (
                <ProductCard key={p.id} product={p} to={`/products/${p.id}`} />
              ))}
        </div>
      </section>

      {/* ── Why ── */}
      <section
        id="why"
        className="relative overflow-hidden border-t border-ink-100 bg-gradient-to-b from-white to-brand-50/40"
      >
        {/* background decoration */}
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-coral-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-700">
              Why SEAPEDIA
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Fresh shopping, zero hassle
            </h2>
            <p className="mt-3 text-ink-500">
              Everything you need to shop fresh from local stores — simple,
              transparent, and delivered to your door.
            </p>
          </div>

          {/* Feature cards */}
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                title: "Fresh from sellers",
                desc: "Buy directly from local stores with transparent stock and pricing.",
                tone: "from-brand-500 to-brand-600",
                icon: (
                  <path d="M3 9l1-5h16l1 5M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16M9 13h6" />
                ),
              },
              {
                title: "Wallet-first checkout",
                desc: "Top up once, pay instantly. PPN and delivery fees shown upfront.",
                tone: "from-coral-500 to-coral-600",
                icon: (
                  <path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 13h.01M3 7l2-3h11l2 3" />
                ),
              },
              {
                title: "Track every step",
                desc: "From packing to your door — follow each order in real time.",
                tone: "from-sky-500 to-sky-600",
                icon: (
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                ),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tone} text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App reviews ── */}
      <ReviewsSection />
    </div>
  );
}
