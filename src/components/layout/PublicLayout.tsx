import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { Button, Logo } from "@/components/ui";
import { cn, ROLE_HOME, ROLE_LABEL } from "@/lib/utils";

export function PublicLayout() {
  const status = useAuthStore((s) => s.status);
  const activeRole = useAuthStore((s) => s.activeRole);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.count);
  const navigate = useNavigate();
  const location = useLocation();
  const authed = status === "authenticated" && activeRole;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Scroll ke section #why di landing. Kalau di halaman lain, ke home dulu.
  function goToWhy() {
    const scrollToWhy = () => {
      const el = document.getElementById("why");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    if (location.pathname === "/") {
      scrollToWhy();
    } else {
      navigate("/");
      setTimeout(scrollToWhy, 300);
    }
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-foam">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Kiri: logo */}
          <Link to="/">
            <Logo className="text-lg" />
          </Link>

          {/* Tengah: menu */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-brand-700"
                    : "text-ink-600 hover:text-ink-900",
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-brand-700"
                    : "text-ink-600 hover:text-ink-900",
                )
              }
            >
              Browse Products
            </NavLink>
            <button
              onClick={goToWhy}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
            >
              Why SEAPEDIA
            </button>
          </nav>

          {/* Kanan: cart + user dropdown / auth */}
          <div className="flex items-center gap-2">
            {authed ? (
              <>
                {/* Cart (hanya buyer) — terpisah, dengan badge */}
                {activeRole === "BUYER" && (
                  <button
                    onClick={() => navigate("/buyer/cart")}
                    className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100"
                    aria-label="Cart"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 7h14l-1.5 9H7.5zM6 7L5 3H3M9 21a1 1 0 1 0 0 .01M17 21a1 1 0 1 0 0 .01" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                )}

                {/* User dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-xl border border-ink-100 py-1.5 pl-1.5 pr-2 transition-colors hover:bg-ink-50"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500 text-xs font-bold text-white">
                      {user?.username?.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="hidden leading-tight text-left sm:block">
                      <p className="text-xs font-semibold text-ink-900">
                        {user?.username}
                      </p>
                      <p className="text-[10px] text-ink-400">
                        {ROLE_LABEL[activeRole]}
                      </p>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className={cn(
                        "h-4 w-4 text-ink-400 transition-transform",
                        menuOpen && "rotate-180",
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-lift animate-fade-up">
                      {/* Header info */}
                      <div className="border-b border-ink-50 px-4 py-3">
                        <p className="text-sm font-semibold text-ink-900">
                          {user?.username}
                        </p>
                        <p className="text-xs text-ink-400">
                          {ROLE_LABEL[activeRole]}
                        </p>
                      </div>

                      <MenuItem
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/buyer/profile");
                        }}
                        icon={
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        }
                        label="Profile"
                      />
                      <MenuItem
                        onClick={() => {
                          setMenuOpen(false);
                          navigate(ROLE_HOME[activeRole]);
                        }}
                        icon={
                          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                        }
                        label="Dashboard"
                      />
                      <div className="my-1 border-t border-ink-50" />
                      <MenuItem
                        onClick={handleLogout}
                        icon={
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        }
                        label="Log out"
                        danger
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/auth/login")}
                >
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate("/auth/register")}>
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Logo className="text-base" />
          <p className="text-sm text-ink-400">
            Fresh from sellers · Same-day delivery · Fair pricing
          </p>
          <p className="text-xs text-ink-300">
            © {new Date().getFullYear()} SEAPEDIA
          </p>
        </div>
      </footer>
    </div>
  );
}

// Satu baris menu di dalam dropdown.
function MenuItem({
  onClick,
  icon,
  label,
  danger = false,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
        danger
          ? "text-coral-600 hover:bg-coral-50"
          : "text-ink-700 hover:bg-ink-50",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icon}
      </svg>
      {label}
    </button>
  );
}
