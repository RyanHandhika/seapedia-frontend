import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { Footer } from "./Footer/Footer";
import { Sidebar, type NavItem } from "./Sidebar/Sidebar";
import { TopBar } from "./Topbar/Topbar";

// ── GUEST LAYOUT ──────────────────────────────────────────
// Wraps all public pages: /, /products, /login, etc.
export function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ── AUTH LAYOUT ───────────────────────────────────────────
// Centered card layout for Login, Register, RoleSelect pages
export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo at top */}
      <a
        href="/"
        className="mb-8 text-2xl font-extrabold font-display bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent"
      >
        SEAPEDIA
      </a>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

// ── DASHBOARD LAYOUT ──────────────────────────────────────
// Shared wrapper for all role dashboards.
// Receives sidebar items as a prop (set by each role layout).
interface DashboardLayoutProps {
  sidebarItems: NavItem[];
  roleColor?: string;
}

export function DashboardLayout({
  sidebarItems,
  roleColor,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar items={sidebarItems} roleColor={roleColor} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
