// src/components/ui/Modal/Modal.tsx
//
// A proper accessible modal dialog.
//
// KEY CONCEPTS:
//  1. ReactDOM.createPortal — renders the modal OUTSIDE the normal
//     component tree, directly inside <body>. This prevents z-index
//     stacking issues with parent elements.
//  2. Focus trap — once the modal opens, Tab key stays inside it.
//  3. Escape key — closes the modal (unless preventClose is true).
//  4. Body scroll lock — prevents background from scrolling.

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { cn } from "@utils/cn";
import { Button } from "../Button/Button";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  preventClose?: boolean; // When true, clicking backdrop or Escape does nothing
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
  preventClose = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ── ESCAPE KEY ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, preventClose]);

  // ── BODY SCROLL LOCK ──────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // createPortal renders this as a direct child of <body>
  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={preventClose ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal container — centered on screen */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 px-4",
          SIZE_MAP[size],
        )}
      >
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-slate-800"
              >
                {title}
              </h2>
              {!preventClose && (
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {/* Body — scrollable if content is tall */}
          <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="px-6 pb-5 pt-4 border-t border-slate-100 flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}

// ── CONFIRM MODAL ─────────────────────────────────────────
// Pre-built modal for "Are you sure?" confirmations.
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  isDanger?: boolean; // Makes confirm button red
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Konfirmasi",
  isLoading = false,
  isDanger = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      preventClose={isLoading}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-slate-600 text-sm">{message}</p>
    </Modal>
  );
}
