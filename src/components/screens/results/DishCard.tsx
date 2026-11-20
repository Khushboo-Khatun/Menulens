"use client";

import React from "react";
import { motion } from "framer-motion";
import { DishItem } from "@/types/dish";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { VegIndicator, Badge } from "@/components/ui/Badge";
import { Flame, Dumbbell, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DishCardProps {
  dish: DishItem;
  calculatedScore?: number;
  scoreTier?: "safe" | "moderate" | "avoid";
  isViolation?: boolean;
  onClick: () => void;
  isTopPick?: boolean;
}

export function DishCard({
  dish,
  calculatedScore,
  scoreTier = "moderate",
  isViolation = false,
  onClick,
  isTopPick = false,
}: DishCardProps) {
  const displayScore = calculatedScore ?? dish.baseScore;

  const tierBadgeConfig = {
    safe: {
      label: "Green Pick",
      variant: "green" as const,
      icon: <CheckCircle2 className="w-3 h-3 text-brand-600 dark:text-emerald-400" />,
    },
    moderate: {
      label: "Yellow • Moderate",
      variant: "amber" as const,
      icon: <AlertCircle className="w-3 h-3 text-amber-500" />,
    },
    avoid: {
      label: isViolation ? "Red • Violation" : "Red • Avoid",
      variant: "red" as const,
      icon: <ShieldAlert className="w-3 h-3 text-red-500" />,
    },
  };

  const badge = tierBadgeConfig[scoreTier] || tierBadgeConfig.moderate;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "rounded-[20px] p-4 bg-white dark:bg-surface-dark border transition-all duration-200 cursor-pointer shadow-card dark:shadow-card-dark select-none relative overflow-hidden",
        isTopPick
          ? "border-brand-500/50 bg-gradient-to-br from-brand-50/50 via-white to-white dark:from-brand-950/20 dark:via-surface-dark dark:to-surface-dark ring-1 ring-brand-500/20"
          : scoreTier === "avoid"
          ? "border-red-200/80 dark:border-red-950/40 hover:border-red-400/40"
          : "border-zinc-200/70 dark:border-zinc-800/80 hover:border-brand-500/30"
      )}
    >
      {isTopPick && (
        <div className="absolute top-0 right-0 bg-brand-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-sm">
          ★ Top Pick
        </div>
      )}

      <div className="flex items-center gap-3.5">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            <VegIndicator isVeg={dish.dietType === "veg"} />
            <Badge variant={badge.variant} size="sm" icon={badge.icon}>
              {badge.label}
            </Badge>
            {dish.price && (
              <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                ₹{dish.price}
              </span>
            )}
          </div>

          <h3 className="font-heading font-bold text-base text-brand-dark dark:text-white truncate">
            {dish.name}
          </h3>

          {dish.hindiName && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-normal truncate -mt-0.5">
              {dish.hindiName}
            </p>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
            {dish.healthVerdict}
          </p>

          {/* Quick Macro Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <Badge variant="neutral" size="sm" icon={<Flame className="w-3 h-3 text-amber-500" />}>
              {dish.nutrition.calories} kcal
            </Badge>
            <Badge variant="brand" size="sm" icon={<Dumbbell className="w-3 h-3 text-brand-600 dark:text-emerald-400" />}>
              {dish.nutrition.protein}g protein
            </Badge>
          </div>
        </div>

        {/* Right: Score Ring */}
        <div className="shrink-0 flex flex-col items-center">
          <ScoreRing score={displayScore} size="md" />
        </div>
      </div>
    </motion.div>
  );
}
