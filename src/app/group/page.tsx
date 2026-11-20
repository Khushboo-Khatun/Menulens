"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/Button";
import { VegIndicator } from "@/components/ui/Badge";
import { DishDetailSheet } from "@/components/screens/results/DishDetailSheet";
import { useGroupStore } from "@/store/useGroupStore";
import { useScanStore } from "@/store/useScanStore";
import { SAMPLE_INDIAN_DISHES } from "@/lib/mock-data";
import { DietType, AllergyType } from "@/types/profile";
import {
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
} from "lucide-react";

export default function GroupPage() {
  const { members, addMember, removeMember } = useGroupStore();
  const { selectedDish, setSelectedDish } = useScanStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDiet, setNewMemberDiet] = useState<DietType>("pure_veg");
  const [newMemberAllergy, setNewMemberAllergy] = useState<AllergyType | "">("");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addMember({
      name: newMemberName.trim(),
      diet: newMemberDiet,
      allergies: newMemberAllergy ? [newMemberAllergy] : [],
      goal: "clean_eating",
    });

    setNewMemberName("");
    setNewMemberDiet("pure_veg");
    setNewMemberAllergy("");
    setIsAddOpen(false);
  };

  // Group consensus logic (Logic preserved)
  const analyzedDishes = SAMPLE_INDIAN_DISHES.map((dish) => {
    const conflicts: { memberName: string; reason: string }[] = [];

    members.forEach((member) => {
      // Veg check
      if (member.diet === "pure_veg" && dish.dietType !== "veg") {
        conflicts.push({ memberName: member.name, reason: "Contains meat/poultry" });
      }
      // Jain check
      if (member.diet === "jain" && (!dish.isJainFriendly || dish.dietType !== "veg")) {
        conflicts.push({ memberName: member.name, reason: "Contains onion, garlic or root veggies" });
      }
      // Vegan check
      if (member.diet === "vegan" && (dish.containsAllergens.includes("dairy") || dish.dietType !== "veg")) {
        conflicts.push({ memberName: member.name, reason: "Contains dairy / animal ingredients" });
      }
      // Allergens
      member.allergies.forEach((allergy) => {
        if (dish.containsAllergens.includes(allergy)) {
          conflicts.push({ memberName: member.name, reason: `Contains ${allergy.replace("_", " ")}` });
        }
      });
    });

    const isConsensusSafe = conflicts.length === 0;

    return {
      dish,
      isConsensusSafe,
      conflicts,
    };
  });

  const safeDishes = analyzedDishes.filter((d) => d.isConsensusSafe);
  const conflictDishes = analyzedDishes.filter((d) => !d.isConsensusSafe);

  return (
    <PageTransition className="pb-24 safe-pb bg-bg-light dark:bg-bg-dark">
      {/* Top Header */}
      <Header
        title="Group Dining Mode"
        subtitle="Multi-profile dining matrix"
        showBack={true}
        rightAction={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-90 text-white flex items-center justify-center transition-all shadow-glow-green-sm"
            title="Add dining companion"
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Concept Explain Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-emerald-50 dark:from-surface-cardDark dark:to-surface-dark border border-brand-500/20 flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-xs text-brand-dark dark:text-white">
              Zero-Conflict Table Ordering
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
              Combines Jain, Pure Veg, and allergy constraints across all friends to calculate dishes everyone can share.
            </p>
          </div>
        </div>

        {/* Member Profile Pills Carousel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Table Members ({members.length})
            </h3>
            <button
              onClick={() => setIsAddOpen(true)}
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-emerald-400 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Friend</span>
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {members.map((m) => (
              <div
                key={m.id}
                className="shrink-0 p-3 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-center gap-3 relative pr-8 min-w-[150px]"
              >
                <div
                  className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-brand-dark dark:text-white leading-tight">
                    {m.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 capitalize">
                    {m.diet.replace("_", " ")}
                  </p>
                </div>
                {members.length > 1 && m.id !== "member-1" && (
                  <button
                    onClick={() => removeMember(m.id)}
                    className="absolute right-2 top-3 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Consensus Dishes Safe for EVERYONE */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-emerald-400" />
            <h3 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
              Safe for Everyone at the Table ({safeDishes.length})
            </h3>
          </div>

          {safeDishes.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
              No dishes satisfy every member&apos;s combined constraints.
            </div>
          ) : (
            <div className="space-y-2">
              {safeDishes.map(({ dish }) => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-brand-500/30 hover:border-brand-500/50 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <VegIndicator isVeg={dish.dietType === "veg"} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-dark dark:text-white">
                          {dish.name}
                        </h4>
                        <span className="text-[9px] bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                          100% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {dish.nutrition.calories} kcal • {dish.nutrition.protein}g protein
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-surface-cardDark text-brand-500 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Conflicted Dishes */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
              Dishes with Dietary Conflicts ({conflictDishes.length})
            </h3>
          </div>

          <div className="space-y-2">
            {conflictDishes.map(({ dish, conflicts }) => (
              <div
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className="p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/80 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <VegIndicator isVeg={dish.dietType === "veg"} />
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-dark dark:text-white">
                      {dish.name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {dish.nutrition.calories} kcal
                  </span>
                </div>

                {/* Conflict Warnings */}
                <div className="space-y-1">
                  {conflicts.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-md"
                    >
                      <XCircle className="w-3 h-3 shrink-0" />
                      <span>
                        Violates <strong>{c.memberName}</strong>: {c.reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Simple Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[360px] bg-white dark:bg-surface-dark rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-brand-dark dark:text-white">
              Add Table Companion
            </h3>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-500 block mb-1">
                  Friend&apos;s Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul, Sneha"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:ring-2 focus:ring-brand-500 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 block mb-1">
                  Dietary Rule
                </label>
                <select
                  value={newMemberDiet}
                  onChange={(e) => setNewMemberDiet(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:ring-2 focus:ring-brand-500 dark:text-white"
                >
                  <option value="pure_veg">Pure Vegetarian</option>
                  <option value="jain">Jain (No Onion / Garlic)</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_veg">Non-Vegetarian</option>
                  <option value="vegan">100% Vegan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 block mb-1">
                  Allergy (Optional)
                </label>
                <select
                  value={newMemberAllergy}
                  onChange={(e) => setNewMemberAllergy(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium focus:ring-2 focus:ring-brand-500 dark:text-white"
                >
                  <option value="">None</option>
                  <option value="dairy">Dairy / Lactose (Paneer, Ghee, Cream)</option>
                  <option value="gluten">Gluten (Maida, Atta Breads)</option>
                  <option value="nuts">Tree Nuts (Cashew Gravies)</option>
                  <option value="deep_fried">Avoid Deep Fried</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" fullWidth>
                  Save Friend
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dish Detail Bottom Sheet */}
      <DishDetailSheet
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
      />
    </PageTransition>
  );
}
