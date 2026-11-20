"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex justify-center items-start">
      <main
        className={cn(
          "w-full max-w-[430px] min-h-screen bg-bg-light dark:bg-bg-dark text-brand-dark dark:text-zinc-100 flex flex-col relative shadow-2xl transition-colors duration-200 overflow-x-hidden",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
