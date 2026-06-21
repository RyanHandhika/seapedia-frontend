// src/components/ui/Alert/Alert.tsx
import { cn } from "@utils/cn";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import React, { useState } from "react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

const ALERT_STYLES: Record<
  AlertType,
  { container: string; icon: React.ElementType; iconColor: string }
> = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  error: {
    container: "bg-red-50   border-red-200   text-red-800",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
  info: {
    container: "bg-blue-50  border-blue-200  text-blue-800",
    icon: Info,
    iconColor: "text-blue-500",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
};

export function Alert({
  type,
  title,
  children,
  dismissible = false,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const { container, icon: Icon, iconColor } = ALERT_STYLES[type];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm",
        container,
        className,
      )}
    >
      <Icon size={18} className={cn("shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 opacity-60 hover:opacity-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
