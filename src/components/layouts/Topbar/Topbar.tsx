import { Menu } from "lucide-react";
import { useUIStore } from "@stores/uiStore";
import { useAuth } from "@hooks/useAuth";
import { ROLE_LABELS, ROLE_COLORS } from "@types";
import { cn } from "@utils/cn";

export function TopBar() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const { activeRole, user } = useAuth();

  const colorMap: Record<string, string> = {
    teal: "bg-teal-100   text-teal-700",
    amber: "bg-amber-100  text-amber-700",
    blue: "bg-blue-100   text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };
  const badgeColor = activeRole
    ? colorMap[ROLE_COLORS[activeRole]]
    : colorMap.teal;

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-4">
      {/* Hamburger (mobile only) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-1.5 text-slate-500 hover:text-slate-700"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* Role badge */}
      {activeRole && (
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            badgeColor,
          )}
        >
          {ROLE_LABELS[activeRole]}
        </span>
      )}

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">
        {user?.username?.slice(0, 2).toUpperCase() ?? "??"}
      </div>
    </header>
  );
}
