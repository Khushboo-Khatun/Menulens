"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ScoreRing({
  score,
  size = "md",
  showLabel = true,
  className,
}: ScoreRingProps) {
  const [displayCount, setDisplayCount] = useState(0);

  const configs = {
    sm: { dimension: 44, strokeWidth: 4, textSize: "text-[12px] font-bold", labelSize: "text-[8px]" },
    md: { dimension: 60, strokeWidth: 5, textSize: "text-base font-extrabold", labelSize: "text-[9px]" },
    lg: { dimension: 88, strokeWidth: 7, textSize: "text-2xl font-black", labelSize: "text-[11px]" },
  };

  const { dimension, strokeWidth, textSize, labelSize } = configs[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Tier-based gradient IDs & glow colors
  let gradientId = `ring-grad-green-${size}`;
  let gradStart = "#1F8A4C";
  let gradEnd = "#4ADE80";
  let trackColor = "rgba(31, 138, 76, 0.12)";
  let textColorClass = "text-brand-600 dark:text-emerald-400";
  let glowColor = "rgba(31, 138, 76, 0.35)";

  if (score < 55) {
    gradientId = `ring-grad-red-${size}`;
    gradStart = "#DC2626";
    gradEnd = "#F87171";
    trackColor = "rgba(220, 38, 38, 0.12)";
    textColorClass = "text-red-500 dark:text-red-400";
    glowColor = "rgba(220, 38, 38, 0.35)";
  } else if (score < 80) {
    gradientId = `ring-grad-amber-${size}`;
    gradStart = "#D97706";
    gradEnd = "#FBBF24";
    trackColor = "rgba(217, 119, 6, 0.12)";
    textColorClass = "text-amber-500 dark:text-amber-400";
    glowColor = "rgba(217, 119, 6, 0.35)";
  }

  // Smooth numeric counter animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 900; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.round(easeOut * score));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [score]);

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={cn("relative inline-flex items-center justify-center shrink-0 select-none", className)}
    >
      <svg
        width={dimension}
        height={dimension}
        className="-rotate-90 transform"
        style={{ filter: size !== "sm" ? `drop-shadow(0 2px 8px ${glowColor})` : undefined }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradStart} />
            <stop offset="100%" stopColor={gradEnd} />
          </linearGradient>
        </defs>

        {/* Ambient Track */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Arc */}
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className={cn("font-heading leading-none tracking-tight", textSize, textColorClass)}>
          {displayCount}
        </span>
        {showLabel && size !== "sm" && (
          <span className={cn("text-zinc-400 dark:text-zinc-500 uppercase font-semibold leading-none mt-0.5 tracking-wider", labelSize)}>
            score
          </span>
        )}
      </div>
    </motion.div>
  );
}
