"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Moon, Sun, UtensilsCrossed } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title = "MenuLens",
  subtitle,
  showBack = false,
  rightAction,
  className,
}: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-md px-4 py-3 border-b border-brand-100/40 dark:border-zinc-800/60 flex items-center justify-between transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {showBack ? (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 active:scale-90 transition-transform shadow-sm"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/20 flex items-center justify-center text-brand-500">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}

        <div>
          <h1 className="text-base font-bold tracking-tight text-brand-dark dark:text-white leading-tight font-heading">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {rightAction}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-9 h-9 rounded-full bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 active:scale-90 transition-transform shadow-sm"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>
      </div>
    </header>
  );
}
