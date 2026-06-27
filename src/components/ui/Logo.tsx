import { cn } from "@/lib/utils";

// SEAPEDIA wordmark with a fish-wave glyph. The glyph is an abstract wave +
// fin — the brand's marine signature, rendered in pure SVG (no external asset).
export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-bold", className)}>
      {mark && (
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <path
            d="M4 18c4-6 10-9 16-9 5 0 8 3 8 3s-2 6-9 9c-6 2.7-12 .5-15-3z"
            className="fill-brand-500"
          />
          <path d="M22 9l5-4-1 6z" className="fill-coral-400" />
          <circle cx="11" cy="15" r="1.6" className="fill-white" />
        </svg>
      )}
      <span className="tracking-tight">
        SEA<span className="text-brand-500">PEDIA</span>
      </span>
    </span>
  );
}
