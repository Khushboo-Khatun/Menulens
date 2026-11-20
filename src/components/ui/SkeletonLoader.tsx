"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-200/80 dark:bg-zinc-800/70 rounded-xl",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
    </div>
  );
}

export function DishCardSkeleton() {
  return (
    <div className="rounded-[20px] p-4 bg-white dark:bg-surface-dark border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm flex items-center justify-between gap-3.5 select-none">
      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-sm" />
          <Skeleton className="h-2.5 w-20 rounded-md" />
        </div>
        <Skeleton className="h-4 w-44 rounded-lg" />
        <Skeleton className="h-3 w-32 rounded-md" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>
      <Skeleton className="w-14 h-14 rounded-full shrink-0" />
    </div>
  );
}

export function TopPicksCarouselSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden py-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[240px] shrink-0 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/60 dark:border-zinc-800/80 space-y-3"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResultsPageSkeleton() {
  return (
    <div className="px-4 pt-3 space-y-4">
      {/* Profile match bar skeleton */}
      <Skeleton className="h-9 w-full rounded-xl" />

      {/* Search bar skeleton */}
      <Skeleton className="h-11 w-full rounded-xl" />

      {/* Filter chips skeleton */}
      <div className="flex gap-2 overflow-hidden">
        <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
        <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
        <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
        <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
      </div>

      {/* Carousel skeleton */}
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-36 rounded" />
        <TopPicksCarouselSkeleton />
      </div>

      {/* Dish cards list skeleton */}
      <div className="space-y-2.5 pt-2">
        <Skeleton className="h-4 w-28 rounded" />
        <DishCardSkeleton />
        <DishCardSkeleton />
        <DishCardSkeleton />
      </div>
    </div>
  );
}
