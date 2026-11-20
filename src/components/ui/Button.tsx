"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  icon,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Fallback gracefully on devices/browsers where vibrate is restricted
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic();
    if (onClick) onClick(e);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-heading font-semibold transition-all select-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5",
    md: "h-11 px-5 text-sm rounded-2xl gap-2",
    lg: "h-14 px-6 text-base rounded-2xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-glow-green-sm active:shadow-none border border-brand-400/30",
    secondary:
      "bg-brand-100 hover:bg-brand-200 active:bg-brand-300 text-brand-700 dark:bg-brand-900/35 dark:text-emerald-300 dark:hover:bg-brand-900/50 active:shadow-none border border-brand-500/10",
    outline:
      "bg-white dark:bg-surface-dark border border-zinc-200/90 dark:border-zinc-800 text-brand-dark dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-surface-cardDark shadow-sm active:shadow-none",
    ghost:
      "bg-transparent hover:bg-zinc-100 dark:hover:bg-surface-cardDark text-zinc-600 dark:text-zinc-300 active:bg-zinc-200/60 dark:active:bg-zinc-800",
    danger:
      "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm border border-red-400/30 active:shadow-none",
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.955 }}
      transition={{ type: "spring", stiffness: 600, damping: 26 }}
      onClick={handleClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}
