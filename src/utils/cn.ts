// ═══════════════════════════════════════════════════════════
// src/utils/cn.ts
//
// Utility to safely merge Tailwind CSS class names.
//
// WHY THIS EXISTS:
// Sometimes you need to conditionally apply classes:
//   className={isActive ? 'bg-teal-600' : 'bg-gray-100'}
// But when you use components with a `className` prop, merging
// classes can cause conflicts. clsx + tailwind-merge solves this.
//
// EXAMPLE:
//   cn('px-4 py-2', isLarge && 'py-4', className)
//   → automatically removes the earlier 'py-2' if 'py-4' is added
// ═══════════════════════════════════════════════════════════
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
