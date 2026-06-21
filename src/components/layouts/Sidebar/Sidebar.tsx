// src/components/layout/Sidebar/Sidebar.tsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { cn } from "@utils/cn";
import { useUIStore } from "@stores/uiStore";
import { useAuthStore } from "@stores/authStore";

export interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: number; // e.g. unread order count
}

interface SidebarProps {
  items: NavItem[];
  roleColor?: string; // Tailwind color name: 'teal', 'amber', 'blue', 'purple'
}

export function Sidebar({ items, roleColor = "teal" }: SidebarProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const activeClass =
    {
      teal: "bg-teal-50   text-teal-700   border-teal-600",
      amber: "bg-amber-50  text-amber-700  border-amber-600",
      blue: "bg-blue-50   text-blue-700   border-blue-600",
      purple: "bg-purple-50 text-purple-700 border-purple-600",
    }[roleColor] ?? "bg-teal-50 text-teal-700 border-teal-600";

  return (
    <>
      {/* Desktop: always-visible fixed sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-slate-100">
            <span className="text-lg font-extrabold font-display bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              SEAPEDIA
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split("/").length <= 2} // exact match for top-level routes
                onClick={closeSidebar}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    "border-l-2",
                    isActive
                      ? cn(activeClass)
                      : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-800",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={18}
                      className={cn(!isActive && "text-slate-400")}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs bg-teal-600 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout at bottom */}
          <div className="px-3 py-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile: overlay drawer */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white shadow-2xl flex flex-col">
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="px-5 py-5 border-b border-slate-100">
                <span className="text-lg font-extrabold font-display bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  SEAPEDIA
                </span>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to.split("/").length <= 2} // exact match for top-level routes
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        "border-l-2",
                        isActive
                          ? cn(activeClass)
                          : "text-slate-600 hover:bg-slate-50 border-transparent hover:text-slate-800",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={18}
                          className={cn(!isActive && "text-slate-400")}
                        />
                        <span className="flex-1">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="text-xs bg-teal-600 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Logout at bottom */}
              <div className="px-3 py-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
