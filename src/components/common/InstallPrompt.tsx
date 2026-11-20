"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("MenuLens PWA ServiceWorker registered with scope:", reg.scope))
          .catch((err) => console.log("ServiceWorker registration failed:", err));
      });
    }

    // 2. Check if already running in standalone PWA mode
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 4. Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user previously dismissed banner
      const dismissed = localStorage.getItem("menulens_install_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If iOS and not dismissed, show prompt after 3s
    if (isAppleDevice && !isStandaloneMode) {
      const dismissed = localStorage.getItem("menulens_install_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 3500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("menulens_install_dismissed", "true");
  };

  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 450, damping: 28 }}
          className="fixed bottom-20 left-4 right-4 z-40 max-w-[400px] mx-auto pointer-events-auto"
        >
          <div className="p-3.5 rounded-2xl bg-brand-dark/95 text-white dark:bg-surface-cardDark/95 border border-brand-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-glow-green-sm">
                <Download className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-xs text-white truncate">
                    Install MenuLens PWA
                  </h4>
                  <span className="text-[9px] bg-brand-400/20 text-brand-300 px-1.5 py-0.2 rounded font-bold">
                    Fast
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 truncate">
                  {isIOS
                    ? "Add to your iPhone Home Screen"
                    : "1-Tap install for fast offline menu OCR"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="primary"
                onClick={handleInstallClick}
                className="h-8 px-3 text-xs"
              >
                {isIOS ? "How to Add" : "Install"}
              </Button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* iOS "Add to Home Screen" Safari Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="w-full max-w-[360px] bg-white dark:bg-surface-dark rounded-3xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-bold text-base text-brand-dark dark:text-white">
                  Add to iPhone Home Screen
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Install MenuLens like a native iOS app without downloading from the App Store:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-surface-cardDark border border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <span className="font-semibold text-brand-dark dark:text-white block">
                    Tap the Safari Share Button
                  </span>
                  <span className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Look for the <Share className="w-3.5 h-3.5 inline text-blue-500" /> icon in the bottom menu bar of Safari.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-surface-cardDark border border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <span className="font-semibold text-brand-dark dark:text-white block">
                    Choose &ldquo;Add to Home Screen&rdquo;
                  </span>
                  <span className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline text-zinc-600 dark:text-zinc-300" /> &ldquo;Add to Home Screen&rdquo;.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-surface-cardDark border border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <span className="font-semibold text-brand-dark dark:text-white block">
                    Tap &ldquo;Add&rdquo; on Top Right
                  </span>
                  <span className="text-zinc-400 text-[11px]">
                    MenuLens will now launch instantly in full-screen standalone mode!
                  </span>
                </div>
              </div>
            </div>

            <Button
              size="md"
              variant="primary"
              fullWidth
              onClick={() => setShowIOSGuide(false)}
            >
              Got It
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}
