import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@hooks/useAuth";
import { Card } from "@components/ui/Card/Card";
import { Badge } from "@components/ui/Badge/Badge";
import { ROLE_LABELS, ROLE_COLORS } from "@types";
import type { Role } from "@types";

export function ProfileSummaryCard() {
  const { user, roles, activeRole } = useAuth();
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  // role can switch only between non-admin roles the user owns
  const nonAdminRoles = (roles as Role[]).filter((r) => r !== "ADMIN");

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-teal-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">
            {user?.username}
          </p>
          <p className="text-sm text-slate-400 truncate">{user?.email}</p>

          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Peran yang dimiliki
            </p>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((role) => (
                <Badge
                  key={role}
                  color={
                    ROLE_COLORS[role as Role] as
                      | "teal"
                      | "amber"
                      | "blue"
                      | "purple"
                  }
                  dot={role === activeRole}
                >
                  {ROLE_LABELS[role as Role]}
                  {role === activeRole && " (aktif)"}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {nonAdminRoles.length > 1 && (
        <Link
          to="/role-select"
          className="mt-4 flex items-center justify-center gap-2 w-full text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg py-2 transition-colors"
        >
          <RefreshCw size={14} /> Ganti Peran Aktif
        </Link>
      )}
    </Card>
  );
}
