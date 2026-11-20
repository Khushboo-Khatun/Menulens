"use client";

import React, { useState } from "react";
import { DishItem } from "@/types/dish";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { VegIndicator, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Check,
  Copy,
  AlertTriangle,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  MessageSquareQuote,
  ShieldCheck,
  Tag,
  ShieldAlert,
  Info,
} from "lucide-react";

interface DishDetailSheetProps {
  dish: DishItem | null;
  isOpen: boolean;
  onClose: () => void;
  calculatedScore?: number;
  scoreTier?: "safe" | "moderate" | "avoid";
  penaltyReasons?: string[];
  positiveReasons?: string[];
  isViolation?: boolean;
}

export function DishDetailSheet({
  dish,
  isOpen,
  onClose,
  calculatedScore,
  scoreTier = "moderate",
  penaltyReasons = [],
  positiveReasons = [],
  isViolation = false,
}: DishDetailSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!dish) return null;

  const score = calculatedScore ?? dish.baseScore;

  const handleCopyWaiterScript = () => {
    navigator.clipboard.writeText(dish.waiterScript.hinglish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const tierBadgeConfig = {
    safe: {
      label: "Green Tag • Recommended",
      variant: "green" as const,
    },
    moderate: {
      label: "Yellow Tag • Moderate",
      variant: "amber" as const,
    },
    avoid: {
      label: isViolation ? "Red Tag • Dietary Violation" : "Red Tag • Avoid",
      variant: "red" as const,
    },
  };

  const badge = tierBadgeConfig[scoreTier] || tierBadgeConfig.moderate;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* Header with Title & Big Score Ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <VegIndicator isVeg={dish.dietType === "veg"} />
              <Badge variant={badge.variant} size="sm">
                {badge.label}
              </Badge>
              {dish.price && (
                <Badge variant="brand" size="sm" icon={<Tag className="w-3 h-3" />}>
                  ₹{dish.price}
                </Badge>
              )}
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-brand-dark dark:text-white leading-tight">
              {dish.name}
            </h2>
            {dish.hindiName && (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">
                {dish.hindiName}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {dish.description}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <ScoreRing score={score} size="lg" />
          </div>
        </div>

        {/* Nutritional Breakdown Cards */}
        <div className="bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 font-heading">
            Estimated Nutrition Per Serving
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white dark:bg-surface-dark p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-center text-amber-500 mb-1">
                <Flame className="w-4 h-4" />
              </div>
              <span className="block font-heading font-bold text-base text-brand-dark dark:text-white">
                {dish.nutrition.calories}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase">
                Calories
              </span>
            </div>

            <div className="bg-white dark:bg-surface-dark p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-center text-brand-500 dark:text-emerald-400 mb-1">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="block font-heading font-bold text-base text-brand-dark dark:text-white">
                {dish.nutrition.protein}g
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase">
                Protein
              </span>
            </div>

            <div className="bg-white dark:bg-surface-dark p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-center text-blue-500 mb-1">
                <Wheat className="w-4 h-4" />
              </div>
              <span className="block font-heading font-bold text-base text-brand-dark dark:text-white">
                {dish.nutrition.carbs}g
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase">
                Carbs
              </span>
            </div>

            <div className="bg-white dark:bg-surface-dark p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-center text-rose-500 mb-1">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="block font-heading font-bold text-base text-brand-dark dark:text-white">
                {dish.nutrition.fats}g
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase">
                Fats
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 flex-wrap gap-2">
            <span>Cooking oil: <strong className="text-brand-dark dark:text-white font-semibold">~{dish.nutrition.estimatedOilTbsp ?? 1.5} tbsp</strong></span>
            <span>Sodium: <strong className="text-brand-dark dark:text-white font-semibold">{dish.nutrition.sodium} mg</strong></span>
            {dish.nutrition.sugar !== undefined && (
              <span>Sugar: <strong className="text-brand-dark dark:text-white font-semibold">{dish.nutrition.sugar}g</strong></span>
            )}
          </div>
        </div>

        {/* Personalized Health Analysis (Positive & Penalty Breakdown) */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-heading">
            Personalized Goal Breakdown
          </h4>
          <div className="space-y-2">
            {/* Penalties / Violations */}
            {penaltyReasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-500/30 text-xs text-red-700 dark:text-red-300"
              >
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}

            {/* Positives */}
            {positiveReasons.map((pos, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/25 border border-brand-500/25 text-xs text-brand-800 dark:text-emerald-300"
              >
                <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{pos}</span>
              </div>
            ))}

            {/* Standard Pros & Watchouts fallback if empty */}
            {penaltyReasons.length === 0 &&
              dish.watchOuts.map((watch, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{watch}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Healthier Swap Suggestion */}
        {dish.healthierSwap && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-brand-950/30 dark:to-emerald-950/20 border border-brand-500/30">
            <div className="flex items-center gap-2 mb-1 text-brand-700 dark:text-emerald-300 font-heading font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-brand-500 dark:text-emerald-400" />
              Healthier Swap Recommendation
            </div>
            <div className="flex items-baseline justify-between gap-2 mt-1">
              <span className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                {dish.healthierSwap.dishName}
              </span>
              <span className="text-[11px] font-semibold text-brand-600 dark:text-emerald-300 bg-white/80 dark:bg-brand-900/50 px-2 py-0.5 rounded-full border border-brand-500/20">
                {dish.healthierSwap.savings}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
              {dish.healthierSwap.description}
            </p>
          </div>
        )}

        {/* "What to Tell the Waiter" Card */}
        <div className="p-4 rounded-2xl bg-brand-dark text-white dark:bg-surface-cardDark dark:border dark:border-brand-500/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300 dark:text-emerald-300">
              <MessageSquareQuote className="w-4 h-4 text-brand-400 dark:text-emerald-400" />
              What to tell the waiter (Customized)
            </div>
            <span className="text-[10px] bg-brand-500/30 text-brand-200 px-2 py-0.5 rounded-md font-medium">
              Hinglish
            </span>
          </div>

          <div className="bg-white/10 dark:bg-black/30 p-3 rounded-xl border border-white/10 text-xs sm:text-sm italic font-medium leading-relaxed">
            &ldquo;{dish.waiterScript.hinglish}&rdquo;
          </div>

          <p className="text-[11px] text-zinc-400">
            English translation: &ldquo;{dish.waiterScript.english}&rdquo;
          </p>

          <Button
            size="sm"
            variant="secondary"
            fullWidth
            onClick={handleCopyWaiterScript}
            icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? "Copied to Clipboard!" : "Copy Waiter Instruction"}
          </Button>
        </div>

        {/* Required Medical Disclaimer Footer */}
        <div className="pt-2 pb-1 text-center">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium inline-flex items-center gap-1.5 justify-center">
            <Info className="w-3.5 h-3.5" />
            <span>General guidance, not medical advice.</span>
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
