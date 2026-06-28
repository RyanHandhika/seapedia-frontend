import { useToastStore } from "@/stores/toastStore";
import { cn } from "@/lib/utils";

const toneStyles = {
  success: "border-brand-200 bg-brand-50 text-brand-800",
  error: "border-coral-200 bg-coral-50 text-coral-800",
  info: "border-ink-200 bg-white text-ink-800",
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[110] flex flex-col items-center gap-2 px-4 sm:top-8">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lift animate-slide-in",
            toneStyles[t.tone],
          )}
        >
          <span className="font-medium">
            {t.tone === "success" ? "✓" : t.tone === "error" ? "!" : "i"}
          </span>
          <span className="text-left">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
