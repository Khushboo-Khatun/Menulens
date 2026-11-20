import { DietType, AllergyType } from "./profile";

export type ScoreTier = "safe" | "moderate" | "avoid";

export interface NutritionInfo {
  calories: number; // kcal
  protein: number;  // grams
  carbs: number;    // grams
  fats: number;     // grams
  sugar?: number;   // grams
  fiber?: number;   // grams
  sodium?: number;  // mg
  estimatedOilTbsp?: number;
}

export interface DishItem {
  id: string;
  name: string;
  hindiName?: string;
  category: "Starters & Tandoor" | "Main Curries" | "Dals & Lentils" | "Breads & Rice" | "Seafood";
  dietType: "veg" | "non_veg" | "egg";
  isJainFriendly: boolean;
  containsAllergens: AllergyType[];
  baseScore: number;
  scoreTier: ScoreTier;
  nutrition: NutritionInfo;
  description: string;
  healthVerdict: string;
  pros: string[];
  watchOuts: string[];
  price?: number | null;
  confidence?: number;
  healthierSwap?: {
    dishName: string;
    savings: string;
    description: string;
  };
  waiterScript: {
    hinglish: string;
    english: string;
  };
  tags: string[];
  imageUrl?: string;
}

export interface GeminiDishResponse {
  name: string;
  price?: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  sodium: number;
  is_veg: boolean;
  confidence: number;
  reason: string;
  swap: string;
}
