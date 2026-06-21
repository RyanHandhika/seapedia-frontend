import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  RefreshCw,
} from "lucide-react";
import { cn } from "@utils/cn";
import { useAuth } from "@hooks/useAuth";
import { useAuthStore } from "@stores/authStore";
import { useCartStore } from "@stores/uiStore";
import { ROLE_LABELS, ROLE_COLORS } from "@types";
import { Button } from "@components/ui/Button/Button";

// ── ROLE BADGE ────────────────────────────────────────────
// Colored pill showing the currently active role
function RoleBadge() {
  const { activeRole } = useAuth();
  if (!activeRole) return null;

  const colorMap: Record<string, string> = {
    teal: "bg-teal-100 text-teal-700 border-teal-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
  };
  const color = colorMap[ROLE_COLORS[activeRole]] ?? colorMap.teal;

  return (
    <span
      className={cn(
        "text-xs font-semibold px-2.5 py-1 rounded-full border",
        color,
      )}
    >
      {ROLE_LABELS[activeRole]}
    </span>
  );
}

// ── USER MENU DROPDOWN ────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, roles, dashboardPath } = useAuth();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
    setOpen(false);
  };

  // User avatar: colored circle with initials
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.username}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>

          <Link
            to={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User size={15} /> Dashboard
          </Link>

          {/* Show "Switch Role" only if user owns multiple non-admin roles */}
          {roles.filter((r) => r !== "ADMIN").length > 1 && (
            <Link
              to="/role-select"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={15} /> Ganti Peran
            </Link>
          )}

          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN NAVBAR ───────────────────────────────────────────
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount);

  const navLinks = [
    { to: "/products", label: "Produk" },
    { to: "/reviews", label: "Ulasan" },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-extrabold font-display bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              SEAPEDIA
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-100",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <RoleBadge />
                {/* Cart icon — only visible for buyers */}
                <Link
                  to="/buyer/cart"
                  className="relative p-2 text-slate-500 hover:text-teal-600 transition-colors"
                >
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Masuk</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link to="/register">Daftar →</Link>
                </Button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="sm:hidden p-2 text-slate-500 hover:text-slate-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
