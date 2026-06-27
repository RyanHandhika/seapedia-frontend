import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button, Logo } from "@/components/ui";
import { cn, ROLE_HOME } from "@/lib/utils";

export function PublicLayout() {
  const status = useAuthStore((s) => s.status);
  const activeRole = useAuthStore((s) => s.activeRole);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const authed = status === "authenticated" && activeRole;

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
              Products
            </NavLink>
          </nav>

          {/* Kanan: auth */}
          <div className="flex items-center gap-3">
            {authed ? (
              <>
                {user && (
                  <span className="hidden text-sm text-ink-500 sm:inline">
                    Hi,{" "}
                    <span className="font-medium text-ink-800">
                      {user.username}
                    </span>
                  </span>
                )}
                <Button
                  size="lg"
                  onClick={() => navigate(ROLE_HOME[activeRole])}
                  className="shadow-lift ring-1 ring-brand-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                  </svg>
                  Go to dashboard
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
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
