// ═══════════════════════════════════════════════════════════
// src/utils/currency.ts
//
// Format numbers as Indonesian Rupiah (IDR).
// Indonesia uses period (.) as thousands separator
// and comma (,) as decimal separator.
//
// EXAMPLES:
//   formatRupiah(150000)  → "Rp 150.000"
//   formatRupiah(1500000) → "Rp 1.500.000"
// ═══════════════════════════════════════════════════════════

export function formatRupiah(amount: number): string {
  // Intl.NumberFormat is built into every browser/Node
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Parse "Rp 150.000" back to 150000 (for inputs)
export function parseRupiah(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

// Short format for cards: 1.500.000 → "1,5 Jt"
export function formatRupiahShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Jt`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}k`;
  }
  return formatRupiah(amount);
}
