"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "amber" | "red" | "neutral" | "brand";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon,
  className,
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1 rounded-md",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
  };

  const variantStyles = {
    green:
      "bg-dishTag-safeBg text-dishTag-safeText dark:bg-dishTag-safeDarkBg dark:text-dishTag-safeDarkText font-semibold border border-brand-500/20",
    amber:
      "bg-dishTag-amberBg text-dishTag-amberText dark:bg-dishTag-amberDarkBg dark:text-dishTag-amberDarkText font-semibold border border-amber-500/20",
    red:
      "bg-dishTag-redBg text-dishTag-redText dark:bg-dishTag-redDarkBg dark:text-dishTag-redDarkText font-semibold border border-red-500/20",
    neutral:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-medium",
    brand:
      "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold border border-brand-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center tracking-tight select-none",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export function VegIndicator({ isVeg }: { isVeg: boolean }) {
  return (
    <div
      className={cn(
        "w-4 h-4 rounded-sm border flex items-center justify-center p-0.5 shrink-0",
        isVeg
          ? "border-emerald-600 dark:border-emerald-500"
          : "border-red-600 dark:border-red-500"
      )}
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isVeg
            ? "bg-emerald-600 dark:bg-emerald-500"
            : "bg-red-600 dark:bg-red-500"
        )}
      />
    </div>
  );
}
