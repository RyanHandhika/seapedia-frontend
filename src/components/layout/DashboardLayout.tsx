import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { ROLE_NAV } from "./navConfig";
import { Logo } from "@/components/ui";
import { cn, ROLE_HOME, ROLE_LABEL } from "@/lib/utils";
import type { Role, SwitchableRole } from "@/types";
import { toast } from "@/stores/toastStore";

function NavIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export function DashboardLayout({ role }: { role: Role }) {
  const nav = ROLE_NAV[role];
  const user = useAuthStore((s) => s.user);
  const roles = useAuthStore((s) => s.roles);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.count);
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);

  const switchable = roles.filter(
    (r): r is SwitchableRole => r !== "ADMIN" && r !== role,
  );

  async function handleSwitch(target: SwitchableRole) {
    try {
      const next = await switchRole(target);
      toast.success(`Switched to ${ROLE_LABEL[next]} mode`);
      navigate(ROLE_HOME[next]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not switch role");
    }
  }

  return (
    <div className="min-h-screen bg-foam">
      {/* ── Sidebar (desktop) ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-ink-100 px-5">
          <Logo className="text-lg" />
        </div>
        <div className="px-3 pt-4">
          <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
            {ROLE_LABEL[role]} workspace
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                )
              }
            >
              <NavIcon path={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-ink-100 p-3">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-coral-50 hover:text-coral-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 17l5-5-5-5M21 12H9M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" />
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-100 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="lg:hidden"><Logo mark={false} className="text-base" /></div>

          <div className="ml-auto flex items-center gap-2">
            {role === "BUYER" && (
              <button
                onClick={() => navigate("/buyer/cart")}
                className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-600 hover:bg-ink-100"
                aria-label="Cart"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 7h14l-1.5 9H7.5zM6 7L5 3H3M9 21a1 1 0 1 0 0 .01M17 21a1 1 0 1 0 0 .01" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {switchable.length > 0 && (
              <div className="hidden items-center gap-1 rounded-xl bg-ink-50 p-1 sm:flex">
                {switchable.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleSwitch(r)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-white hover:text-brand-700"
                  >
                    Switch to {ROLE_LABEL[r]}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 rounded-xl border border-ink-100 py-1.5 pl-1.5 pr-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-xs font-bold text-white">
                {user?.username?.slice(0, 2).toUpperCase()}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-semibold text-ink-900">{user?.username}</p>
                <p className="text-[10px] text-ink-400">{ROLE_LABEL[role]}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-ink-950/40" onClick={() => setMobileNav(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-lift animate-slide-in">
            <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
              <Logo className="text-lg" />
              <button onClick={() => setMobileNav(false)} className="text-ink-400" aria-label="Close">✕</button>
            </div>
            <nav className="space-y-1 p-3">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNav(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                      isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50",
                    )
                  }
                >
                  <NavIcon path={item.icon} />
                  {item.label}
                </NavLink>
              ))}
              {switchable.map((r) => (
                <button
                  key={r}
                  onClick={() => { setMobileNav(false); handleSwitch(r); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  ⇄ Switch to {ROLE_LABEL[r]}
                </button>
              ))}
              <button onClick={() => logout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-coral-600 hover:bg-coral-50">
                Log out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ── Mobile bottom nav (primary items) ── */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-ink-100 bg-white/95 backdrop-blur lg:hidden">
        {nav.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium",
                isActive ? "text-brand-600" : "text-ink-400",
              )
            }
          >
            <NavIcon path={item.icon} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
