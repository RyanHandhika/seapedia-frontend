// ═══════════════════════════════════════════════════════════
// src/utils/date.ts
//
// All date formatting is in Indonesian (id-ID locale).
// ═══════════════════════════════════════════════════════════

// "12 Jun 2025"
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

// "12 Jun 2025, 10:32 WIB"
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

// "2 jam yang lalu", "kemarin", "3 hari lalu"
// Uses the Intl.RelativeTimeFormat API (built-in, no library needed)
export function relativeTime(iso: string): string {
  const formatter = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSeconds) < 60)
    return formatter.format(diffSeconds, "second");
  if (Math.abs(diffMinutes) < 60)
    return formatter.format(diffMinutes, "minute");
  if (Math.abs(diffHours) < 24) return formatter.format(diffHours, "hour");
  return formatter.format(diffDays, "day");
}
