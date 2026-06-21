// ═══════════════════════════════════════════════════════════
// src/utils/sanitize.ts
//
// Prevent XSS (Cross-Site Scripting) attacks in user content.
//
// WHY THIS IS IMPORTANT:
// SEAPEDIA has public review comments. If a user submits:
//   <script>alert('hacked!')</script>
// And we render it with dangerouslySetInnerHTML, it executes!
//
// SOLUTION:
// 1. Always use React's {variable} interpolation (safe by default)
// 2. Use this escapeHtml() only when you MUST use innerHTML
// 3. The reviewSchema in Zod also validates max length
//
// In React, {comment} is already safe. This utility is a backup
// and for any server-side rendering or non-React contexts.
// ═══════════════════════════════════════════════════════════

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (char) => HTML_ESCAPES[char]);
}

// Strips ALL HTML tags — useful for previews
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Truncates text to a max length with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
