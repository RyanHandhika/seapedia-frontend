import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/ui";

// Keunggulan yang ditampilkan di panel kiri (desktop).
const FEATURES = [
  {
    title: "Fresh from sellers",
    desc: "Buy directly from local stores with transparent stock.",
    icon: (
      <path d="M3 9l1-5h16l1 5M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M4 9h16M9 13h6" />
    ),
  },
  {
    title: "Wallet-first checkout",
    desc: "Top up once, pay instantly. Fees shown upfront.",
    icon: (
      <path d="M3 7h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 13h.01M3 7l2-3h11l2 3" />
    ),
  },
  {
    title: "Track every step",
    desc: "From packing to your door — follow each order in real time.",
    icon: (
      <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    ),
  },
];

// Split auth layout — brand panel on the left (desktop), form on the right.
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col overflow-hidden bg-ink-900 p-12 text-white lg:flex">
        {/* Logo (atas) */}
        <Link to="/" className="relative z-10">
          <Logo className="text-xl text-white [&_span]:text-white" />
        </Link>

        {/* Konten utama — di tengah secara vertikal, mengisi gap */}
        <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-4xl font-bold leading-tight">
            The freshest market,
            <br />
            <span className="text-brand-300">end to end.</span>
          </h1>
          <p className="mt-4 max-w-sm text-ink-300">
            One account to buy, open a store, or deliver. Switch roles anytime —
            your wallet, orders, and trips travel with you.
          </p>

          {/* Daftar keunggulan */}
          <ul className="mt-10 space-y-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </span>
                <div>
                  <p className="font-display font-semibold">{f.title}</p>
                  <p className="text-sm text-ink-400">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Statistik (bawah) */}
        <div className="relative z-10 flex gap-6 border-t border-white/10 pt-6 text-sm">
          <div>
            <p className="font-display text-2xl font-bold text-brand-300">
              ≤3h
            </p>
            <p className="text-ink-400">Instant delivery</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-brand-300">
              100%
            </p>
            <p className="text-ink-400">Transparent pricing</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-brand-300">
              24/7
            </p>
            <p className="text-ink-400">Order tracking</p>
          </div>
        </div>

        {/* Ambient wave */}
        <svg
          viewBox="0 0 400 200"
          className="absolute -bottom-10 left-0 w-full opacity-20"
          aria-hidden
        >
          <path
            d="M0 120 Q100 80 200 120 T400 120 V200 H0Z"
            className="fill-brand-500"
          />
          <path
            d="M0 140 Q100 100 200 140 T400 140 V200 H0Z"
            className="fill-brand-400"
          />
        </svg>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col overflow-hidden bg-foam px-4 py-6 lg:items-center lg:justify-center lg:py-10">
        {/* Subtle background accents (desktop) */}
        <div className="pointer-events-none absolute -right-20 -top-20 hidden h-72 w-72 rounded-full bg-brand-100/40 blur-3xl lg:block" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 hidden h-72 w-72 rounded-full bg-coral-100/30 blur-3xl lg:block" />

        {/* Mobile top bar: back button + clickable logo (desktop hides this) */}
        <div className="relative z-10 mb-8 flex items-center justify-between lg:hidden">
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-lg py-2 pr-3 text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </Link>
          <Link to="/">
            <Logo className="text-lg" />
          </Link>
        </div>

        {/* Form panel */}
        <div className="flex flex-col bg-foam px-4 py-6 lg:items-center lg:justify-center lg:py-10">
          {/* Form */}
          <div className="flex w-full flex-1 items-center justify-center lg:flex-none">
            <div className="w-full max-w-sm">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
