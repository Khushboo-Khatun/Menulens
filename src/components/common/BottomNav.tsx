"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Users, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on welcome, onboarding, or during scanning view
  if (pathname === "/welcome" || pathname === "/onboarding" || pathname === "/scan") {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
    },
    {
      label: "Scan",
      href: "/scan",
      icon: Camera,
      isPrimary: true,
    },
    {
      label: "Results",
      href: "/results",
      icon: Sparkles,
    },
    {
      label: "Group",
      href: "/group",
      icon: Users,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-[430px] bg-white/95 dark:bg-surface-dark/95 backdrop-blur-lg border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 safe-pb flex justify-around items-center pointer-events-auto shadow-sheet transition-colors">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-90 text-white flex items-center justify-center shadow-glow-green transition-all duration-200 border-4 border-bg-light dark:border-bg-dark">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-brand-600 dark:text-emerald-400 mt-0.5 tracking-tight">
                  Scan Menu
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-90",
                isActive
                  ? "text-brand-500 dark:text-emerald-400 font-semibold"
                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
