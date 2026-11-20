"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/common/Header";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUserStore } from "@/store/useUserStore";
import { useScanStore } from "@/store/useScanStore";
import {
  Camera,
  Sparkles,
  ChevronRight,
  History,
  Store,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { startScan, loadSampleMenu } = useScanStore();

  const handleStartScan = () => {
    startScan("Pind Balluchi & Tandoor");
    router.push("/scan");
  };

  const handleSelectSample = (restaurant: string) => {
    loadSampleMenu(restaurant);
    router.push("/results");
  };

  const recentScans = [
    {
      id: "scan-1",
      name: "Pind Balluchi & Tandoor",
      location: "Connaught Place, New Delhi",
      dishCount: 10,
      topScore: 96,
      cuisine: "North Indian & Mughlai",
    },
    {
      id: "scan-2",
      name: "Saravana Bhavan",
      location: "Indiranagar, Bengaluru",
      dishCount: 14,
      topScore: 92,
      cuisine: "South Indian Pure Veg",
    },
    {
      id: "scan-3",
      name: "Mainland China",
      location: "Bandra West, Mumbai",
      dishCount: 12,
      topScore: 89,
      cuisine: "Indo-Chinese",
    },
  ];

  return (
    <PageTransition className="pb-24 safe-pb bg-bg-light dark:bg-bg-dark">
      {/* Top App Header */}
      <Header
        title="MenuLens"
        subtitle="Health-First Dining"
        rightAction={
          <Link href="/onboarding">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-900/35 text-brand-600 dark:text-emerald-300 border border-brand-500/20 capitalize select-none">
              {profile.diet.replace("_", " ")}
            </span>
          </Link>
        }
      />

      <div className="p-4 space-y-4">
        {/* Active Health Profile Bar */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800 shadow-card dark:shadow-card-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-900/35 text-brand-500 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-heading font-bold text-brand-dark dark:text-white capitalize">
                  {profile.goal.replace("_", " ")}
                </span>
                <span className="text-[10px] text-zinc-400">•</span>
                <span className="text-xs text-brand-600 dark:text-emerald-400 font-semibold capitalize">
                  {profile.diet.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {profile.allergies.length > 0
                  ? `Avoiding ${profile.allergies.join(", ")}`
                  : "All dishes eligible"}
              </p>
            </div>
          </div>
          <Link
            href="/onboarding"
            className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Edit
          </Link>
        </div>

        {/* Big Hero "Scan Menu" Action Card */}
        <Card
          variant="highlight"
          className="relative overflow-hidden p-6 text-center space-y-4 border-2 border-brand-500/30 dark:border-brand-500/30 shadow-card dark:shadow-card-dark"
        >
          {/* Subtle Ambient Background circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-brand-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Shutter Animation Icon with tactile press */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            onClick={handleStartScan}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-glow-green cursor-pointer relative"
          >
            <Camera className="w-9 h-9 stroke-[2.2]" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-brand-300"
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </motion.div>

          <div className="space-y-1">
            <h2 className="font-heading font-extrabold text-2xl text-brand-dark dark:text-white">
              Scan Menu Photo
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[260px] mx-auto">
              Snap a physical menu page or upload from photos to evaluate health scores.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              size="lg"
              fullWidth
              onClick={handleStartScan}
              icon={<Camera className="w-5 h-5" />}
            >
              Open Camera Scanner
            </Button>

            <Link href="/results">
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={<Sparkles className="w-4 h-4 text-brand-500 dark:text-emerald-400" />}
              >
                View Scored Indian Dishes
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Sample Menu Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
              Try Sample Menus
            </h3>
            <span className="text-[11px] text-zinc-400">Pre-analyzed</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectSample("Pind Balluchi & Tandoor")}
              className="p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-brand-500/40 select-none transition-all"
            >
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-emerald-400 bg-brand-50 dark:bg-brand-900/35 px-1.5 py-0.5 rounded">
                North Indian
              </span>
              <h4 className="font-heading font-bold text-xs text-brand-dark dark:text-white mt-1.5 truncate">
                Pind Balluchi
              </h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">10 dishes scored</p>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelectSample("Dakshin Bhavan Tiffin")}
              className="p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-brand-500/40 select-none transition-all"
            >
              <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                South Indian
              </span>
              <h4 className="font-heading font-bold text-xs text-brand-dark dark:text-white mt-1.5 truncate">
                Dakshin Bhavan
              </h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">8 dishes scored</p>
            </motion.div>
          </div>
        </div>

        {/* Recent Scans Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              <h3 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                Recent Menus Scanned
              </h3>
            </div>
            <Link
              href="/results"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 dark:text-emerald-400"
            >
              See all
            </Link>
          </div>

          <div className="space-y-2">
            {recentScans.map((scan) => (
              <motion.div
                key={scan.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectSample(scan.name)}
                className="p-3.5 rounded-2xl bg-white dark:bg-surface-dark border border-zinc-200/70 dark:border-zinc-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-500/30 transition-all select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-surface-cardDark text-brand-500 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <Store className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-brand-dark dark:text-white">
                      {scan.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {scan.cuisine} • {scan.dishCount} dishes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Top match</span>
                    <span className="text-xs font-bold text-brand-500 dark:text-emerald-400 font-heading">
                      {scan.topScore}/100
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
