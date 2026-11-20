"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  icon?: React.ReactNode;
}

export function FilterChip({
  label,
  isActive,
  onClick,
  count,
  icon,
}: FilterChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none",
        isActive
          ? "bg-brand-500 text-white shadow-glow-green-sm"
          : "bg-white dark:bg-surface-dark text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full",
            isActive
              ? "bg-white/20 text-white font-bold"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}
