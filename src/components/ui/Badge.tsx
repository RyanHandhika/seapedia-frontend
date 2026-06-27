import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "amber" | "blue" | "violet" | "green" | "red" | "gray" | "brand" | "coral";

const tones: Record<Tone, string> = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  green: "bg-brand-50 text-brand-700 ring-brand-200",
  red: "bg-coral-50 text-coral-700 ring-coral-200",
  gray: "bg-ink-100 text-ink-600 ring-ink-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  coral: "bg-coral-50 text-coral-700 ring-coral-200",
};

export function Badge({
  tone = "gray",
  children,
  pulse,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {pulse && (
        <span className={cn("h-1.5 w-1.5 rounded-full bg-current", "animate-pulse")} aria-hidden />
      )}
      {children}
    </span>
  );
}
