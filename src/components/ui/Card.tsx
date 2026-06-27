import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  interactive?: boolean;
}

// Signature: cards carry a 2px bottom accent in the brand color when `accent`.
export function Card({ accent, interactive, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-100 bg-white shadow-card",
        accent && "border-b-2 border-b-brand-400",
        interactive &&
          "transition-all hover:-translate-y-0.5 hover:shadow-lift cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-ink-100 p-5">
      <div>
        <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Metric card for dashboards — label, big number, optional delta.
export function MetricCard({
  label,
  value,
  delta,
  icon,
  tone = "brand",
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
  tone?: "brand" | "coral" | "ink";
}) {
  const toneMap = {
    brand: "text-brand-600 bg-brand-50",
    coral: "text-coral-600 bg-coral-50",
    ink: "text-ink-600 bg-ink-100",
  };
  return (
    <Card className="overflow-hidden">
      <CardBody className="flex items-center gap-4">
        {icon && (
          <div className={cn("grid h-11 w-11 place-items-center rounded-xl", toneMap[tone])}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-400">
            {label}
          </p>
          <p className="mt-0.5 font-display text-2xl font-semibold text-ink-900">{value}</p>
          {delta && <p className="text-xs text-brand-600">{delta}</p>}
        </div>
      </CardBody>
    </Card>
  );
}
