// src/components/ui/Badge/Badge.tsx
import { cn } from "@utils/cn";
import type { OrderStatus } from "@types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@types";

type BadgeColor =
  | "teal"
  | "amber"
  | "blue"
  | "indigo"
  | "purple"
  | "red"
  | "green"
  | "slate";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean; // Show a colored dot before the label
  children: React.ReactNode;
  className?: string;
}

// Tailwind color classes for each color option
const COLOR_MAP: Record<BadgeColor, string> = {
  teal: "bg-teal-100   text-teal-700",
  amber: "bg-amber-100  text-amber-700",
  blue: "bg-blue-100   text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
  red: "bg-red-100    text-red-700",
  green: "bg-green-100  text-green-700",
  slate: "bg-slate-100  text-slate-600",
};

const DOT_MAP: Record<BadgeColor, string> = {
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  green: "bg-green-500",
  slate: "bg-slate-400",
};

import React from "react";

export function Badge({
  color = "slate",
  size = "md",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        COLOR_MAP[color],
        className,
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", DOT_MAP[color])} />
      )}
      {children}
    </span>
  );
}

// ── STATUS BADGE ───────────────────────────────────────────
// Specialized badge for order lifecycle statuses.
// Maps OrderStatus enum → correct color + Indonesian label automatically.
interface StatusBadgeProps {
  status: OrderStatus;
  size?: BadgeSize;
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <Badge color={ORDER_STATUS_COLORS[status] as BadgeColor} size={size} dot>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
