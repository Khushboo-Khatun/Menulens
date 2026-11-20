"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/common/Header";
import { PageTransition } from "@/components/common/PageTransition";
import { DishCard } from "@/components/screens/results/DishCard";
import { DishDetailSheet } from "@/components/screens/results/DishDetailSheet";
import { FilterChip } from "@/components/ui/FilterChip";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ResultsPageSkeleton } from "@/components/ui/SkeletonLoader";
import { VegIndicator } from "@/components/ui/Badge";
import { useScanStore } from "@/store/useScanStore";
import { useUserStore } from "@/store/useUserStore";
import { calculatePersonalizedScore } from "@/lib/score-calculator";
import { DishItem } from "@/types/dish";
import {
  Camera,
  Search,
  Sparkles,
  Flame,
  Dumbbell,
  Leaf,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function ResultsPage() {
  const { currentResult, selectedDish, setSelectedDish } = useScanStore();
  const { profile } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const dishes = currentResult?.dishes || [];

  // Smooth skeleton loading on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 1. Calculate personalized scores against active user profile
  const scoredDishes = useMemo(() => {
    return dishes.map((dish) => {
      const result = calculatePersonalizedScore(dish, profile);
      return {
        ...dish,
        personalizedScore: result.score,
        scoreTier: result.tier, // "safe" (Green) | "moderate" (Yellow) | "avoid" (Red)
        penaltyReasons: result.penaltyReasons,
        positiveReasons: result.positiveReasons,
        isViolation: result.isViolation,
      };
    });
  }, [dishes, profile]);

  // 2. Sort Green First, then Yellow, then Red (and secondary sort by score)
  const sortedAndFilteredDishes = useMemo(() => {
    const tierPriority = {
      safe: 3,     // Green
      moderate: 2, // Yellow
      avoid: 1,    // Red
    };

    return scoredDishes
      .filter((dish) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dish.name.toLowerCase().includes(q);
          const matchHindi = dish.hindiName?.toLowerCase().includes(q);
          const matchCategory = dish.category.toLowerCase().includes(q);
          if (!matchName && !matchHindi && !matchCategory) return false;
        }

        if (activeFilter === "green") return dish.scoreTier === "safe";
        if (activeFilter === "yellow") return dish.scoreTier === "moderate";
        if (activeFilter === "red") return dish.scoreTier === "avoid";
        if (activeFilter === "pure_veg") return dish.dietType === "veg";
        if (activeFilter === "high_protein") return dish.nutrition.protein >= 20;
        if (activeFilter === "low_cal") return dish.nutrition.calories <= 350;
        if (activeFilter === "jain") return dish.isJainFriendly;

        return true;
      })
      .sort((a, b) => {
        // Primary: Green (safe) > Yellow (moderate) > Red (avoid)
        const diff = tierPriority[b.scoreTier] - tierPriority[a.scoreTier];
        if (diff !== 0) return diff;
        // Secondary: Higher score first
        return b.personalizedScore - a.personalizedScore;
      });
  }, [scoredDishes, activeFilter, searchQuery]);

  // 3. Top 3 Picks (Green dishes prioritized)
  const top3Picks = useMemo(() => {
    // Pick Green safe dishes first
    const greenPicks = scoredDishes
      .filter((d) => d.scoreTier === "safe")
      .sort((a, b) => b.personalizedScore - a.personalizedScore);

    if (greenPicks.length >= 3) {
      return greenPicks.slice(0, 3);
    }

    // If fewer than 3 green dishes exist, pad with top non-violation moderate dishes
    const nonViolations = scoredDishes
      .filter((d) => !d.isViolation)
      .sort((a, b) => b.personalizedScore - a.personalizedScore);

    return nonViolations.slice(0, 3);
  }, [scoredDishes]);

  // Selected dish full result details for the bottom sheet
  const selectedDishScored = useMemo(() => {
    if (!selectedDish) return null;
    const found = scoredDishes.find((d) => d.id === selectedDish.id);
    if (found) return found;

    const result = calculatePersonalizedScore(selectedDish, profile);
    return {
      ...selectedDish,
      personalizedScore: result.score,
      scoreTier: result.tier,
      penaltyReasons: result.penaltyReasons,
      positiveReasons: result.positiveReasons,
      isViolation: result.isViolation,
    };
  }, [selectedDish, scoredDishes, profile]);

  const greenCount = scoredDishes.filter((d) => d.scoreTier === "safe").length;
  const yellowCount = scoredDishes.filter((d) => d.scoreTier === "moderate").length;
  const redCount = scoredDishes.filter((d) => d.scoreTier === "avoid").length;

  return (
    <PageTransition className="pb-24 safe-pb bg-bg-light dark:bg-bg-dark">
      {/* Top Header */}
      <Header
        title={currentResult?.restaurantName || "Menu Results"}
        subtitle={`${dishes.length} dishes parsed & tagged`}
        showBack={true}
        rightAction={
          <Link
            href="/scan"
            className="w-9 h-9 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-emerald-400 flex items-center justify-center active:scale-90 transition-transform"
            title="Scan another menu"
          >
            <Camera className="w-4 h-4 stroke-[2.2]" />
          </Link>
        }
      />

      {isLoading ? (
        <ResultsPageSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Saved Profile Rule Summary Bar */}
          <div className="px-4 pt-3">
            <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                  {profile.goal === "fat_loss" && "Fat Loss: Protein/calorie prioritized"}
                  {profile.goal === "diabetes_friendly" && "Diabetes: Sugar & refined carbs penalized"}
                  {profile.goal === "heart_health" && "BP / Heart: Sodium penalized"}
                  {profile.goal === "muscle_gain" && "Muscle Gain: High protein rewarded"}
                  {profile.goal === "clean_eating" && "Clean Dining: Balanced homestyle picks"}
                </span>
              </div>
              <Link
                href="/onboarding"
                className="text-brand-600 dark:text-emerald-400 font-semibold text-[11px] hover:underline shrink-0 ml-2"
              >
                Change
              </Link>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="px-4">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search dish (paneer, dal, chicken, roti)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:text-white shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Color Tag Filter Chips (Green / Yellow / Red / Category) */}
          <div className="px-4 overflow-x-auto no-scrollbar flex items-center gap-2 py-0.5">
            <FilterChip
              label="All (Green First)"
              isActive={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              count={dishes.length}
            />
            <FilterChip
              label="🟢 Green Tag"
              isActive={activeFilter === "green"}
              onClick={() => setActiveFilter("green")}
              count={greenCount}
            />
            <FilterChip
              label="🟡 Yellow Tag"
              isActive={activeFilter === "yellow"}
              onClick={() => setActiveFilter("yellow")}
              count={yellowCount}
            />
            <FilterChip
              label="🔴 Red Tag"
              isActive={activeFilter === "red"}
              onClick={() => setActiveFilter("red")}
              count={redCount}
            />
            <FilterChip
              label="Pure Veg"
              isActive={activeFilter === "pure_veg"}
              onClick={() => setActiveFilter("pure_veg")}
              icon={<Leaf className="w-3.5 h-3.5 text-emerald-500" />}
            />
            <FilterChip
              label="High Protein"
              isActive={activeFilter === "high_protein"}
              onClick={() => setActiveFilter("high_protein")}
              icon={<Dumbbell className="w-3.5 h-3.5 text-brand-500" />}
            />
            <FilterChip
              label="Low Calorie"
              isActive={activeFilter === "low_cal"}
              onClick={() => setActiveFilter("low_cal")}
              icon={<Flame className="w-3.5 h-3.5 text-amber-500" />}
            />
          </div>

          {/* Top 3 Picks Carousel (Highlighted Green Picks) */}
          {activeFilter === "all" && !searchQuery && top3Picks.length > 0 && (
            <div className="space-y-2.5">
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-500 dark:text-emerald-400" />
                  <h3 className="font-heading font-extrabold text-sm text-brand-dark dark:text-white tracking-tight">
                    Top 3 Green Picks
                  </h3>
                </div>
                <span className="text-[11px] text-brand-600 dark:text-emerald-400 font-semibold bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full border border-brand-500/20">
                  Green Tags Only
                </span>
              </div>

              <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar py-1">
                {top3Picks.map((pick, i) => (
                  <motion.div
                    key={pick.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedDish(pick)}
                    className="w-[245px] shrink-0 p-4 rounded-2xl bg-gradient-to-b from-brand-50/80 to-white dark:from-surface-cardDark dark:to-surface-dark border-2 border-brand-500/40 shadow-card dark:shadow-card-dark cursor-pointer transition-all select-none space-y-2.5 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <VegIndicator isVeg={pick.dietType === "veg"} />
                        <span className="text-[10px] font-bold uppercase text-brand-700 dark:text-emerald-300">
                          #{i + 1} Best Match
                        </span>
                      </div>
                      <ScoreRing score={pick.personalizedScore} size="sm" />
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white truncate">
                        {pick.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {pick.hindiName || pick.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      <span>{pick.nutrition.calories} kcal</span>
                      <span>•</span>
                      <span>{pick.nutrition.protein}g protein</span>
                      {pick.price && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-brand-700 dark:text-emerald-400">₹{pick.price}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Main Sorted Dishes List (Green first, Yellow second, Red last) */}
          <div className="px-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                All Scored Dishes ({sortedAndFilteredDishes.length})
              </h3>
              <span className="text-[11px] text-zinc-400">Sorted: 🟢 Green &gt; 🟡 Yellow &gt; 🔴 Red</span>
            </div>

            {sortedAndFilteredDishes.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-surface-dark rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                  No matching dishes found
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Try selecting another filter or adjusting your search term.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {sortedAndFilteredDishes.map((dish, idx) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.025, duration: 0.2 }}
                  >
                    <DishCard
                      dish={dish}
                      calculatedScore={dish.personalizedScore}
                      scoreTier={dish.scoreTier}
                      isViolation={dish.isViolation}
                      isTopPick={top3Picks.some((p) => p.id === dish.id)}
                      onClick={() => setSelectedDish(dish)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Required Medical Disclaimer Footer */}
          <div className="px-4 pt-6 pb-2 text-center">
            <div className="p-3 rounded-xl bg-zinc-100/70 dark:bg-surface-cardDark border border-zinc-200/60 dark:border-zinc-800/80 inline-flex items-center justify-center gap-1.5 w-full">
              <Info className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                General guidance, not medical advice.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dish Detail Bottom Sheet */}
      <DishDetailSheet
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
        calculatedScore={selectedDishScored?.personalizedScore}
        scoreTier={selectedDishScored?.scoreTier}
        penaltyReasons={selectedDishScored?.penaltyReasons}
        positiveReasons={selectedDishScored?.positiveReasons}
        isViolation={selectedDishScored?.isViolation}
      />
    </PageTransition>
  );
}
