// src/components/ui/Spinner/Spinner.tsx
import { cn } from "@utils/cn";

type SpinnerSize = "xs" | "sm" | "md" | "lg";
type SpinnerColor = "white" | "teal" | "slate";

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const SIZE_MAP: Record<SpinnerSize, string> = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

const COLOR_MAP: Record<SpinnerColor, string> = {
  white: "border-white/30 border-t-white",
  teal: "border-teal-200 border-t-teal-600",
  slate: "border-slate-200 border-t-slate-600",
};

export function Spinner({
  size = "md",
  color = "teal",
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Memuat..."
      className={cn(
        "inline-block rounded-full animate-spin",
        SIZE_MAP[size],
        COLOR_MAP[color],
        className,
      )}
    />
  );
}
