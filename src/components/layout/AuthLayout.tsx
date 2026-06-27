import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/ui";

// Split auth layout — brand panel on the left (desktop), form on the right.
export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 text-white lg:flex">
        <Link to="/"><Logo className="text-xl text-white [&_span]:text-white" /></Link>
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold leading-tight">
            The freshest market,<br />
            <span className="text-brand-300">end to end.</span>
          </h1>
          <p className="mt-4 max-w-sm text-ink-300">
            One account to buy, open a store, or deliver. Switch roles anytime —
            your wallet, orders, and trips travel with you.
          </p>
          <div className="mt-8 flex gap-6 text-sm">
            <div>
              <p className="font-display text-2xl font-bold text-brand-300">≤3h</p>
              <p className="text-ink-400">Instant delivery</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-brand-300">12%</p>
              <p className="text-ink-400">PPN handled</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-brand-300">4-in-1</p>
              <p className="text-ink-400">Roles per account</p>
            </div>
          </div>
        </div>
        {/* Ambient wave */}
        <svg viewBox="0 0 400 200" className="absolute -bottom-10 left-0 w-full opacity-20" aria-hidden>
          <path d="M0 120 Q100 80 200 120 T400 120 V200 H0Z" className="fill-brand-500" />
          <path d="M0 140 Q100 100 200 140 T400 140 V200 H0Z" className="fill-brand-400" />
        </svg>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-foam px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo className="text-xl" /></div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
