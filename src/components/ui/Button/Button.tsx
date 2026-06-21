// ═══════════════════════════════════════════════════════════
// src/components/ui/Button/Button.tsx
//
// The main Button component used everywhere in SEAPEDIA.
//
// VARIANTS:
//   primary   = teal background — main CTAs ("Checkout", "Simpan")
//   secondary = slate background — secondary actions
//   outline   = border only — less emphasis
//   ghost     = no background — navbar links, subtle actions
//   danger    = red — delete, cancel, destructive actions
//
// SIZES: xs, sm, md (default), lg
//
// LOADING STATE:
//   When isLoading=true, the button shows a spinner and is
//   automatically disabled — prevents double-submitting forms.
// ═══════════════════════════════════════════════════════════

import React from "react";
import { cn } from "@utils/cn";
import { Spinner } from "../Spinner/Spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  // When true, Button applies its styling to its child element (e.g. <Link>)
  // instead of rendering a <button>. Avoids invalid HTML like a <button>
  // wrapping an <a> tag.
  //   <Button asChild><Link to="/login">Masuk</Link></Button>
  asChild?: boolean;
}

// Tailwind class maps for each variant and size
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 focus-visible:ring-teal-500",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400",
  outline:
    "border border-teal-600 text-teal-600 bg-transparent hover:bg-teal-50 focus-visible:ring-teal-500",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "h-6  px-2   text-xs  gap-1",
  sm: "h-8  px-3   text-sm  gap-1.5",
  md: "h-10 px-4   text-sm  gap-2",
  lg: "h-12 px-6   text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  asChild = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const sharedClassName = cn(
    // Base styles applied to all buttons
    "inline-flex items-center justify-center rounded-lg font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    // Disabled state
    "disabled:opacity-50 disabled:cursor-not-allowed",
    // Apply variant + size
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {/* Left icon OR loading spinner */}
      {isLoading ? (
        <Spinner
          size="sm"
          color={
            variant === "primary" || variant === "danger" ? "white" : "teal"
          }
        />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}

      {/* Button label */}
      {children && <span>{children}</span>}

      {/* Right icon (not shown while loading) */}
      {rightIcon && !isLoading && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  // asChild: merge our styling onto the single child element (e.g. <Link>)
  // instead of rendering a <button>. This is how we get a styled <a> tag
  // that still navigates via React Router, instead of nesting a <button>
  // inside/around an <a> (which is invalid HTML).
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    return React.cloneElement(child, {
      className: cn(sharedClassName, child.props.className),
      children: (
        <>
          {isLoading ? (
            <Spinner
              size="sm"
              color={
                variant === "primary" || variant === "danger" ? "white" : "teal"
              }
            />
          ) : leftIcon ? (
            <span className="shrink-0">{leftIcon}</span>
          ) : null}
          {child.props.children}
          {rightIcon && !isLoading && (
            <span className="shrink-0">{rightIcon}</span>
          )}
        </>
      ),
    });
  }

  return (
    <button {...props} disabled={isDisabled} className={sharedClassName}>
      {content}
    </button>
  );
}
