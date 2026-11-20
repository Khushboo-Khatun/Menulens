"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/common/Header";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/store/useUserStore";
import { HealthGoal, DietType, AllergyType } from "@/types/profile";
import {
  Flame,
  Dumbbell,
  Heart,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Apple,
  ShieldAlert,
  Leaf,
  Egg,
  Beef,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, setGoal, setDiet, toggleAllergy, completeOnboarding } = useUserStore();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const goals: { id: HealthGoal; title: string; desc: string; icon: any }[] = [
    {
      id: "fat_loss",
      title: "Fat Loss & Calorie Deficit",
      desc: "Penalize heavy cream gravies, maida & deep-fried snacks.",
      icon: Flame,
    },
    {
      id: "muscle_gain",
      title: "Muscle Gain & High Protein",
      desc: "Highlight 25g+ protein dishes (paneer, chicken, soy, lentils).",
      icon: Dumbbell,
    },
    {
      id: "diabetes_friendly",
      title: "Diabetic / Low Glycemic",
      desc: "Filter out high-GI refined breads, sweet curries & cornstarch.",
      icon: Heart,
    },
    {
      id: "heart_health",
      title: "Heart Health & Low Sodium",
      desc: "Watch saturated animal fats, palm oils & excessive salted gravies.",
      icon: Droplets,
    },
    {
      id: "clean_eating",
      title: "Clean Everyday Eating",
      desc: "Homestyle minimal oil cooking with whole grains and veggies.",
      icon: Sparkles,
    },
  ];

  const diets: { id: DietType; title: string; desc: string; icon: any; tag?: string }[] = [
    {
      id: "pure_veg",
      title: "Pure Vegetarian",
      desc: "Plant-based + dairy, strictly zero egg, meat, or seafood.",
      icon: Leaf,
      tag: "Green Dot",
    },
    {
      id: "jain",
      title: "Jain Vegetarian",
      desc: "No root vegetables (onion, garlic, potato, carrots) & no meat/eggs.",
      icon: Sparkles,
      tag: "Strict Jain",
    },
    {
      id: "eggetarian",
      title: "Eggetarian",
      desc: "Vegetarian with egg preparations allowed, no poultry/meat.",
      icon: Egg,
    },
    {
      id: "non_veg",
      title: "Non-Vegetarian",
      desc: "Chicken, mutton, seafood, eggs & vegetarian items.",
      icon: Beef,
    },
    {
      id: "vegan",
      title: "100% Vegan",
      desc: "Zero animal products — strictly avoids paneer, ghee, curd & cream.",
      icon: Apple,
    },
    {
      id: "sattvic",
      title: "Sattvic Dining",
      desc: "Gentle, non-stimulating food cooked without onion or garlic.",
      icon: Leaf,
    },
  ];

  const allergies: { id: AllergyType; title: string; desc: string }[] = [
    {
      id: "dairy",
      title: "Dairy / Lactose Intolerant",
      desc: "Flag paneer, butter, ghee, malai, cream & curd bases.",
    },
    {
      id: "gluten",
      title: "Gluten / Celiac (Maida & Atta)",
      desc: "Flag naans, rumali roti, bhature, parathas & wheat coatings.",
    },
    {
      id: "nuts",
      title: "Tree Nuts & Peanuts",
      desc: "Crucial in North Indian curries: flags cashew paste (kaju gravy).",
    },
    {
      id: "deep_fried",
      title: "Avoid Deep Fried Items",
      desc: "Flags bhature, pakoras, papad fry, samosas, puris.",
    },
    {
      id: "soy",
      title: "Soy & Soya Chaap",
      desc: "Flags soya chaap curries and soy protein isolates.",
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as any);
    } else {
      completeOnboarding();
      router.push("/home");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    } else {
      router.back();
    }
  };

  return (
    <PageTransition className="justify-between min-h-screen bg-bg-light dark:bg-bg-dark pb-8 safe-pb">
      {/* Top Header */}
      <div>
        <Header
          title="Personalize Profile"
          subtitle={`Step ${currentStep} of 3`}
          showBack={true}
        />

        {/* Stepper Progress Bar */}
        <div className="px-5 pt-3 pb-2">
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
            <motion.div
              className="h-full bg-brand-500 dark:bg-emerald-400 rounded-full"
              initial={{ width: "33%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Step Content */}
      <div className="flex-1 px-5 py-3 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-extrabold text-xl text-brand-dark dark:text-white">
                  What is your primary health goal?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We customize the dish health score (0-100) based on your physiological target.
                </p>
              </div>

              <div className="space-y-2.5">
                {goals.map((item) => {
                  const Icon = item.icon;
                  const isSelected = profile.goal === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGoal(item.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between shadow-sm select-none",
                        isSelected
                          ? "bg-brand-50/80 dark:bg-surface-cardDark border-brand-500 ring-2 ring-brand-500/20"
                          : "bg-white dark:bg-surface-dark border-zinc-200/80 dark:border-zinc-800 hover:border-brand-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-brand-500 text-white shadow-glow-green-sm"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors",
                          isSelected
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-extrabold text-xl text-brand-dark dark:text-white">
                  What is your dietary preference?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  We automatically weed out non-compliant ingredients from your recommendations.
                </p>
              </div>

              <div className="space-y-2.5">
                {diets.map((item) => {
                  const Icon = item.icon;
                  const isSelected = profile.diet === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDiet(item.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between shadow-sm select-none",
                        isSelected
                          ? "bg-brand-50/80 dark:bg-surface-cardDark border-brand-500 ring-2 ring-brand-500/20"
                          : "bg-white dark:bg-surface-dark border-zinc-200/80 dark:border-zinc-800 hover:border-brand-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-brand-500 text-white shadow-glow-green-sm"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                              {item.title}
                            </h4>
                            {item.tag && (
                              <span className="text-[10px] bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors",
                          isSelected
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-heading font-extrabold text-xl text-brand-dark dark:text-white">
                  Any allergies or ingredients to avoid?
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Select all that apply. We flag these clearly on every dish card.
                </p>
              </div>

              <div className="space-y-2.5">
                {allergies.map((item) => {
                  const isSelected = profile.allergies.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAllergy(item.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between shadow-sm select-none",
                        isSelected
                          ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20"
                          : "bg-white dark:bg-surface-dark border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/30"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                            isSelected
                              ? "bg-amber-500 text-white"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          )}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-colors",
                          isSelected
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-5 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/80 bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md flex items-center gap-3">
        {currentStep > 1 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-1/3"
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          fullWidth={currentStep === 1}
          className={currentStep > 1 ? "w-2/3" : "w-full"}
          icon={currentStep === 3 ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        >
          {currentStep === 3 ? "Complete & Start Scanning" : "Continue"}
        </Button>
      </div>
    </PageTransition>
  );
}
