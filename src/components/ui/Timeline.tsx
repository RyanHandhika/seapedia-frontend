import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  description?: string;
  timestamp?: string;
  state: "done" | "current" | "upcoming";
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-1">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[7px] top-5 h-full w-0.5",
                  step.state === "done" ? "bg-brand-300" : "bg-ink-100",
                )}
                aria-hidden
              />
            )}
            {/* Dot */}
            <span
              className={cn(
                "relative z-10 mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ring-2",
                step.state === "done" && "bg-brand-500 ring-brand-100",
                step.state === "current" && "bg-brand-400 ring-brand-100 animate-pulse-ring",
                step.state === "upcoming" && "bg-white ring-ink-200",
              )}
              aria-hidden
            >
              {step.state === "done" && (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white" fill="none">
                  <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="-mt-0.5 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.state === "upcoming" ? "text-ink-400" : "text-ink-900",
                )}
              >
                {step.title}
              </p>
              {step.description && <p className="text-xs text-ink-500">{step.description}</p>}
              {step.timestamp && <p className="mt-0.5 text-xs text-ink-400">{step.timestamp}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
