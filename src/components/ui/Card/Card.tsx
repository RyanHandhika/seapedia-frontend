// src/components/ui/Card/Card.tsx
import React from "react";
import { cn } from "@utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean; // Lifts on hover — for clickable cards
}

const PADDING_MAP = { none: "", sm: "p-3", md: "p-5", lg: "p-6" };

export function Card({
  padding = "md",
  hoverable = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        PADDING_MAP[padding],
        hoverable &&
          "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Sub-components for structured card layouts
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pb-3 mb-3 border-b border-slate-100 font-semibold text-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-slate-600", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("pt-3 mt-3 border-t border-slate-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}
