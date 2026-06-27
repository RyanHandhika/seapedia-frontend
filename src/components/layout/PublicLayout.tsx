import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button, Logo } from "@/components/ui";
import { cn, ROLE_HOME } from "@/lib/utils";

export function PublicLayout() {
  const status = useAuthStore((s) => s.status);
  const activeRole = useAuthStore((s) => s.activeRole);
  const navigate = useNavigate();
  const authed = status === "authenticated" && activeRole;

  return (
    <div className="flex min-h-screen flex-col bg-foam">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8">
          <Link to="/">
            <Logo className="text-lg" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { to: "/products", label: "Browse" },
              { to: "/#why", label: "Why SEAPEDIA" },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-brand-700"
                      : "text-ink-600 hover:text-ink-900",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {authed ? (
              <Button size="sm" onClick={() => navigate(ROLE_HOME[activeRole])}>
                Go to dashboard
              </Button>
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
