import React from "react";

type Color = "blue" | "green" | "amber" | "red" | "gray" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

const colorClasses: Record<Color, string> = {
  blue: "bg-primary-50 text-primary-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-gray-100 text-gray-600",
  purple: "bg-purple-50 text-purple-700",
};

export default function Badge({
  children,
  color = "blue",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        colorClasses[color],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
