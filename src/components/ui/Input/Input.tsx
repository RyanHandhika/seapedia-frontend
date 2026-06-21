// ═══════════════════════════════════════════════════════════
// src/components/ui/Input/Input.tsx
//
// Accessible form input with label, error, and hint support.
//
// USAGE:
//   <Input label="Email" type="email" error={errors.email?.message} />
//   <Input label="Harga" leftAddon="Rp" type="number" />
//   <Input label="Password" type="password" rightAddon={<EyeIcon />} />
// ═══════════════════════════════════════════════════════════

import React, { useId } from "react";
import { cn } from "@utils/cn";

// ── Base wrapper props shared by Input, Textarea, Select ──
interface BaseFieldProps {
  label?: string;
  error?: string; // Red border + message below field
  hint?: string; // Grey helper text below field
  required?: boolean;
}

// ── INPUT ─────────────────────────────────────────────────
interface InputProps
  extends
    BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  leftAddon?: React.ReactNode; // e.g. "Rp" text or search icon
  rightAddon?: React.ReactNode; // e.g. eye icon for password
}

export function Input({
  label,
  error,
  hint,
  required,
  leftAddon,
  rightAddon,
  className,
  ...props
}: InputProps) {
  // useId generates a unique ID for aria linking label ↔ input
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left addon (e.g. "Rp" prefix) */}
        {leftAddon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
            {leftAddon}
          </div>
        )}

        <input
          id={id}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-lg border bg-white text-sm text-slate-900",
            "placeholder:text-slate-400 transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
            "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
            // Padding adjusts for addons
            leftAddon ? "pl-10" : "pl-3",
            rightAddon ? "pr-10" : "pr-3",
            "py-2.5",
            // Error vs normal border
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 hover:border-slate-400",
            className,
          )}
          {...props}
        />

        {/* Right addon (e.g. eye icon) */}
        {rightAddon && (
          <div className="absolute right-3 flex items-center text-slate-400">
            {rightAddon}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <span>⚠</span> {error}
        </p>
      )}

      {/* Hint text (only shown if no error) */}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}

// ── TEXTAREA ──────────────────────────────────────────────
interface TextareaProps
  extends
    BaseFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  maxCount?: number; // Show character counter
}

export function Textarea({
  label,
  error,
  hint,
  required,
  maxCount,
  className,
  value,
  ...props
}: TextareaProps) {
  const id = useId();
  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        id={id}
        value={value}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-lg border bg-white text-sm text-slate-900 px-3 py-2.5",
          "placeholder:text-slate-400 transition-colors duration-150 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
          error ? "border-red-400" : "border-slate-300 hover:border-slate-400",
          className,
        )}
        {...props}
      />

      <div className="flex justify-between">
        {error ? (
          <p role="alert" className="text-xs text-red-500">
            ⚠ {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-slate-400">{hint}</p>
        ) : (
          <span />
        )}

        {maxCount && (
          <p
            className={cn(
              "text-xs",
              charCount > maxCount ? "text-red-500" : "text-slate-400",
            )}
          >
            {charCount}/{maxCount}
          </p>
        )}
      </div>
    </div>
  );
}

// ── SELECT ────────────────────────────────────────────────
interface SelectProps
  extends
    BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  placeholder?: string;
}

export function Select({
  label,
  error,
  hint,
  required,
  placeholder,
  className,
  children,
  ...props
}: SelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <select
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-lg border bg-white text-sm text-slate-900 px-3 py-2.5",
          "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent",
          "disabled:bg-slate-50 disabled:cursor-not-allowed",
          error ? "border-red-400" : "border-slate-300",
          className,
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>

      {error && (
        <p role="alert" className="text-xs text-red-500">
          ⚠ {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
