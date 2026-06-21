import { useEffect } from "react";
import ReactDOM from "react-dom";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@utils/cn";
import { useUIStore, type Toast as ToastType } from "@stores/uiStore";

const TOAST_STYLES = {
  success: {
    bar: "bg-green-500",
    icon: CheckCircle,
    iconClass: "text-green-500",
  },
  error: { bar: "bg-red-500", icon: XCircle, iconClass: "text-red-500" },
  info: { bar: "bg-blue-500", icon: Info, iconClass: "text-blue-500" },
  warning: {
    bar: "bg-amber-500",
    icon: AlertTriangle,
    iconClass: "text-amber-500",
  },
};

function Toast({ id, type, message, duration = 4000 }: ToastType) {
  const removeToast = useUIStore((s) => s.removeToast);
  const { bar, icon: Icon, iconClass } = TOAST_STYLES[type];

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <div className="relative flex items-start gap-3 bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 pr-10 max-w-sm w-full overflow-hidden">
      {/* Colored left bar */}
      <div
        className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", bar)}
      />

      <Icon size={18} className={cn("shrink-0 mt-0.5", iconClass)} />
      <p className="text-sm text-slate-700 flex-1">{message}</p>

      <button
        onClick={() => removeToast(id)}
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── TOAST CONTAINER ───────────────────────────────────────
// Renders all active toasts in a fixed position on screen.
// Lives in App.tsx, rendered once for the entire app.
export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
