import { create } from "zustand";
import { DishItem, GeminiDishResponse } from "@/types/dish";
import { ScannedMenuResult } from "@/types/menu";
import { SAMPLE_INDIAN_DISHES } from "@/lib/mock-data";
import { mapGeminiDishesToDishItems } from "@/lib/gemini-mapper";

interface ScanState {
  currentResult: ScannedMenuResult | null;
  selectedDish: DishItem | null;
  activeFilter: string; // "all" | "top_picks" | "veg" | "high_protein" | "low_cal" | "jain"
  searchQuery: string;
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  scanStatusMessage: string;
  lastScannedImage: string | null;

  startScan: (restaurantName?: string) => void;
  setScanProgress: (progress: number, msg: string) => void;
  finishScan: (result: ScannedMenuResult) => void;
  setGeminiScanResult: (restaurantName: string, rawDishes: GeminiDishResponse[], imageUrl?: string) => void;
  setSelectedDish: (dish: DishItem | null) => void;
  setActiveFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
  loadSampleMenu: (restaurantName: string) => void;
}

export const useScanStore = create<ScanState>((set) => ({
  currentResult: {
    restaurantName: "Pind Balluchi & Tandoor",
    scannedAt: "Just now",
    totalDishesFound: SAMPLE_INDIAN_DISHES.length,
    dishes: SAMPLE_INDIAN_DISHES,
  },
  selectedDish: null,
  activeFilter: "all",
  searchQuery: "",
  isScanning: false,
  scanProgress: 0,
  scanStatusMessage: "Ready to scan",
  lastScannedImage: null,

  startScan: (restaurantName = "Analyzing Menu...") => {
    set({
      isScanning: true,
      scanProgress: 10,
      scanStatusMessage: "Uploading menu photo...",
    });
  },

  setScanProgress: (progress, msg) => {
    set({ scanProgress: progress, scanStatusMessage: msg });
  },

  finishScan: (result) => {
    set({
      isScanning: false,
      scanProgress: 100,
      currentResult: result,
      activeFilter: "all",
      lastScannedImage: result.imageUrl || null,
    });
  },

  setGeminiScanResult: (restaurantName, rawDishes, imageUrl) => {
    const dishes = mapGeminiDishesToDishItems(rawDishes);
    const result: ScannedMenuResult = {
      restaurantName: restaurantName || "Scanned Menu",
      scannedAt: "Just now",
      totalDishesFound: dishes.length,
      dishes,
      imageUrl,
    };

    set({
      isScanning: false,
      scanProgress: 100,
      currentResult: result,
      activeFilter: "all",
      lastScannedImage: imageUrl || null,
    });
  },

  setSelectedDish: (dish) => set({ selectedDish: dish }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  loadSampleMenu: (restaurantName) => {
    set({
      currentResult: {
        restaurantName,
        scannedAt: "Demo Menu",
        totalDishesFound: SAMPLE_INDIAN_DISHES.length,
        dishes: SAMPLE_INDIAN_DISHES,
      },
      activeFilter: "all",
      lastScannedImage: null,
    });
  },
}));
