"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useScanStore } from "@/store/useScanStore";
import { useUserStore } from "@/store/useUserStore";
import {
  Camera,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  KeyRound,
  FileQuestion,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScanPage() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { setGeminiScanResult, loadSampleMenu } = useScanStore();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Ready to scan");
  const [errorInfo, setErrorInfo] = useState<{
    code: string;
    title: string;
    message: string;
  } | null>(null);

  // Status stage ticker during live analysis
  useEffect(() => {
    if (!isAnalyzing) return;

    setProgress(15);
    setStatusMessage("Uploading menu photo securely...");

    const t1 = setTimeout(() => {
      setProgress(40);
      setStatusMessage("Gemini Vision reading Hindi & English menu sections...");
    }, 1200);

    const t2 = setTimeout(() => {
      setProgress(70);
      setStatusMessage("Decoding hidden oils, gravies, and macronutrients...");
    }, 3200);

    const t3 = setTimeout(() => {
      setProgress(88);
      setStatusMessage(`Scoring against your ${profile.diet.replace("_", " ")} profile...`);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isAnalyzing, profile.diet]);

  // Handle image selection from Camera or Gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorInfo(null);
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    await uploadAndAnalyzePhoto(file, previewUrl);
  };

  // Upload photo to backend route /api/analyze
  const uploadAndAnalyzePhoto = async (file: File | Blob, previewUrl: string) => {
    setIsAnalyzing(true);
    setErrorInfo(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setIsAnalyzing(false);

        if (data.code === "MISSING_API_KEY") {
          setErrorInfo({
            code: "MISSING_API_KEY",
            title: "Gemini API Key Required",
            message:
              "Please add your GEMINI_API_KEY to .env.local to enable live AI menu photo scanning.",
          });
        } else if (data.code === "BLURRY_OR_UNCLEAR" || res.status === 422) {
          setErrorInfo({
            code: "BLURRY_OR_UNCLEAR",
            title: "Photo Too Blurry or Unclear",
            message:
              data.error ||
              "The camera couldn't read the menu text clearly. Please hold steady with good lighting and avoid shadows or glares.",
          });
        } else {
          setErrorInfo({
            code: data.code || "ERROR",
            title: "Could Not Analyze Menu",
            message: data.error || "An error occurred while analyzing the menu photo. Please try again.",
          });
        }
        return;
      }

      // Success: Valid JSON returned from Gemini
      setProgress(100);
      setStatusMessage(`Complete! ${data.dishes.length} dishes identified & scored.`);

      // Give user 600ms to appreciate the 100% checkmark before transition
      setTimeout(() => {
        setGeminiScanResult(data.restaurant_name, data.dishes, previewUrl);
        router.push("/results");
      }, 700);
    } catch (err: any) {
      console.error("Scan upload error:", err);
      setIsAnalyzing(false);
      setErrorInfo({
        code: "NETWORK_ERROR",
        title: "Connection Failed",
        message: "Failed to connect to the /api/analyze server. Please verify your connection.",
      });
    }
  };

  // Fallback demo menu handler
  const handleUseDemoMenu = () => {
    loadSampleMenu("Pind Balluchi & Tandoor");
    router.push("/results");
  };

  const handleRetake = () => {
    setErrorInfo(null);
    setSelectedImage(null);
    setIsAnalyzing(false);
    setProgress(0);
    cameraInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen bg-zinc-950 text-white relative overflow-hidden pb-8 safe-pb select-none">
      {/* Hidden File Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Header Controls Overlay */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 to-transparent">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform shadow-sm"
          title="Close scanner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span>Gemini Vision AI</span>
        </div>

        <button
          onClick={handleUseDemoMenu}
          className="text-[11px] font-semibold text-zinc-300 hover:text-white bg-white/10 px-2.5 py-1.5 rounded-full backdrop-blur-md border border-white/15 active:scale-95 transition-all"
        >
          Demo Menu
        </button>
      </div>

      {/* Center Viewfinder with Laser & Photo Preview */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-3xl bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-5">
          {/* Real Photo Preview Background */}
          {selectedImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${selectedImage})` }}
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]" />
            </div>
          ) : (
            /* Faux Menu Placeholder Lines if no photo picked yet */
            <div className="space-y-4 opacity-40 pointer-events-none select-none my-auto">
              <div className="w-28 h-4 bg-brand-400/40 rounded-md" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="h-3 w-36 bg-zinc-700 rounded block" />
                  <span className="h-3 w-8 bg-zinc-700 rounded block" />
                </div>
                <span className="h-2 w-48 bg-zinc-800 rounded block" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="h-3 w-40 bg-zinc-700 rounded block" />
                  <span className="h-3 w-8 bg-zinc-700 rounded block" />
                </div>
                <span className="h-2 w-32 bg-zinc-800 rounded block" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="h-3 w-32 bg-zinc-700 rounded block" />
                  <span className="h-3 w-8 bg-zinc-700 rounded block" />
                </div>
                <span className="h-2 w-40 bg-zinc-800 rounded block" />
              </div>
            </div>
          )}

          {/* Viewfinder Target Reticle Corners */}
          <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-brand-400 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-brand-400 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-brand-400 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-brand-400 rounded-br-xl pointer-events-none" />

          {/* Scanning Animation: Laser Bar + Radar */}
          {isAnalyzing && (
            <>
              {/* Vertical Laser Beam */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_18px_#4ade80]"
                animate={{
                  top: ["8%", "88%", "8%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Radar Pulses */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-brand-400/40 pointer-events-none"
                animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            </>
          )}

          {/* Prompt Banner inside viewfinder when idle */}
          {!selectedImage && !isAnalyzing && (
            <div className="relative z-10 my-auto text-center space-y-2 p-3 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-md">
              <Camera className="w-8 h-8 text-brand-400 mx-auto" />
              <h3 className="font-heading font-bold text-sm text-white">
                Ready to Read Menu
              </h3>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Supports English, Hindi &amp; Hinglish printed menus.
              </p>
            </div>
          )}

          {/* Top Badge */}
          <div className="relative z-10 mx-auto px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-brand-400/40 flex items-center gap-2 text-xs font-semibold text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>
              {isAnalyzing
                ? "Analyzing with Gemini Vision..."
                : selectedImage
                ? "Menu Photo Loaded"
                : "Point at Restaurant Menu"}
            </span>
          </div>

          <div />
        </div>
      </div>

      {/* Friendly Error State for Blurry Photo or Missing Key */}
      <AnimatePresence>
        {errorInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6 mb-3 z-30"
          >
            <div className="p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-2xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  {errorInfo.code === "MISSING_API_KEY" ? (
                    <KeyRound className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-sm text-amber-300">
                    {errorInfo.title}
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {errorInfo.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="primary"
                  fullWidth
                  onClick={handleRetake}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Retake Photo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  onClick={handleUseDemoMenu}
                >
                  Use Demo Menu
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls / Status Area */}
      <div className="relative z-20 px-6 space-y-4">
        {/* Progress Bar when analyzing */}
        {isAnalyzing && (
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-500 rounded-full shadow-[0_0_10px_#1F8A4C]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        {/* Dynamic Status Ticker */}
        {isAnalyzing && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                {progress === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-sm text-white truncate">
                  {statusMessage}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate">
                  {progress}% completed • Hindi &amp; English OCR
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trigger Buttons */}
        {!isAnalyzing && (
          <div className="space-y-2.5">
            <Button
              size="lg"
              fullWidth
              onClick={() => cameraInputRef.current?.click()}
              icon={<Camera className="w-5 h-5" />}
            >
              Take Photo with Camera
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => galleryInputRef.current?.click()}
                icon={<Upload className="w-4 h-4 text-brand-400" />}
              >
                Upload from Gallery
              </Button>

              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={handleUseDemoMenu}
                icon={<Sparkles className="w-4 h-4 text-brand-500" />}
              >
                Demo Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
