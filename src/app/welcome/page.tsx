"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/common/Header";
import { PageTransition } from "@/components/common/PageTransition";
import {
  Sparkles,
  Camera,
  HeartPulse,
  ChefHat,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useScanStore } from "@/store/useScanStore";

export default function WelcomePage() {
  const router = useRouter();
  const { completeOnboarding } = useUserStore();
  const { loadSampleMenu } = useScanStore();

  const handleDemoMode = () => {
    completeOnboarding();
    loadSampleMenu("Pind Balluchi & Tandoor");
    router.push("/home");
  };

  const highlights = [
    {
      icon: Camera,
      title: "Point & Scan Any Menu",
      desc: "Takes photos of physical menus and decodes dishes instantly.",
    },
    {
      icon: HeartPulse,
      title: "Personalized Health Scores (0-100)",
      desc: "Scores dishes against your diet (Pure Veg, Jain, High Protein, Fat Loss).",
    },
    {
      icon: ChefHat,
      title: "Customized Waiter Scripts",
      desc: "Hinglish requests ready to read to your waiter for lighter cooking.",
    },
  ];

  return (
    <PageTransition className="justify-between p-5 pb-8 safe-pb bg-bg-light dark:bg-bg-dark">
      {/* Top Bar with Dark Mode Toggle */}
      <Header />

      {/* Hero Visual & Branding */}
      <div className="my-auto py-6 space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-glow-green"
        >
          <Sparkles className="w-12 h-12 stroke-[1.8]" />
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-surface-dark px-2.5 py-0.5 rounded-full shadow-md border border-brand-100 dark:border-zinc-800 flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Health 1st</span>
          </div>
        </motion.div>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-500/20 text-brand-700 dark:text-emerald-300 text-xs font-semibold"
          >
            <span>🇮🇳 Built for Indian Dining Out</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-dark dark:text-white tracking-tight leading-tight"
          >
            Dine Out Without <br />
            <span className="text-brand-500 dark:text-emerald-400">Derailing Your Health</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed"
          >
            Scan restaurant menus, uncover hidden oils & gravies, and order with confidence.
          </motion.p>
        </div>

        {/* Feature Highlights Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2.5 text-left pt-2"
        >
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-surface-cardDark text-brand-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-brand-dark dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Link href="/onboarding" className="block w-full">
          <Button size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
            Set Up Your Health Profile
          </Button>
        </Link>

        <button
          onClick={handleDemoMode}
          className="w-full text-center text-xs font-semibold text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-emerald-400 py-2 transition-colors flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 dark:text-emerald-400" />
          <span>Skip to Home with Demo Indian Menu</span>
        </button>
      </div>
    </PageTransition>
  );
}
