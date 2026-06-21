// ═══════════════════════════════════════════════════════════
// src/hooks/useToast.ts
//
// Convenience hook for showing toast notifications.
// Usage:
//   const toast = useToast();
//   toast.success('Produk berhasil disimpan!');
//   toast.error('Gagal menyimpan.');
// ═══════════════════════════════════════════════════════════

import { useUIStore } from "@stores/uiStore";

export function useToast() {
  const addToast = useUIStore((s) => s.addToast);

  return {
    success: (message: string) => addToast({ type: "success", message }),
    error: (message: string) => addToast({ type: "error", message }),
    info: (message: string) => addToast({ type: "info", message }),
    warning: (message: string) => addToast({ type: "warning", message }),
  };
}
