"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "flat" | "highlight";
  noPadding?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  noPadding = false,
  className,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800/80 shadow-card dark:shadow-card-dark",
    elevated:
      "bg-white dark:bg-surface-dark border border-zinc-100 dark:border-zinc-800 shadow-xl",
    flat:
      "bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50",
    highlight:
      "bg-gradient-to-br from-brand-50 to-white dark:from-surface-dark dark:to-surface-cardDark border border-brand-500/30 shadow-glow-green-sm",
  };

  return (
    <motion.div
      className={cn(
        "rounded-[20px] transition-colors duration-200",
        variantStyles[variant],
        !noPadding && "p-4 sm:p-5",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
