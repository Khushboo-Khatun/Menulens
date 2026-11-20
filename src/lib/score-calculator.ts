import { DishItem } from "@/types/dish";
import { UserProfile } from "@/types/profile";

export interface PersonalizedScoreResult {
  score: number;
  tier: "safe" | "moderate" | "avoid"; // Green, Yellow, Red
  penaltyReasons: string[];
  positiveReasons: string[];
  isViolation: boolean;
}

export function calculatePersonalizedScore(
  dish: DishItem,
  profile: UserProfile
): PersonalizedScoreResult {
  let score = dish.baseScore || 80;
  const penaltyReasons: string[] = [];
  const positiveReasons: string[] = [];
  let isViolation = false;

  const nameLower = (dish.name + " " + (dish.description || "")).toLowerCase();

  // -------------------------------------------------------------
  // 1. DIET VIOLATIONS (STRICTLY ALWAYS RED)
  // -------------------------------------------------------------
  if (profile.diet === "pure_veg" && dish.dietType !== "veg") {
    isViolation = true;
    penaltyReasons.push("Diet Violation: Contains meat/poultry/fish (Pure Veg rule)");
  } else if (profile.diet === "jain") {
    if (
      !dish.isJainFriendly ||
      dish.dietType !== "veg" ||
      nameLower.includes("onion") ||
      nameLower.includes("garlic") ||
      nameLower.includes("pyaz") ||
      nameLower.includes("lehsun") ||
      nameLower.includes("potato") ||
      nameLower.includes("aloo")
    ) {
      isViolation = true;
      penaltyReasons.push("Diet Violation: Contains onion, garlic or root vegetables (Jain rule)");
    }
  } else if (profile.diet === "vegan") {
    if (dish.containsAllergens.includes("dairy") || dish.dietType !== "veg") {
      isViolation = true;
      penaltyReasons.push("Diet Violation: Contains dairy, ghee, butter or animal products (Vegan rule)");
    }
  } else if (profile.diet === "eggetarian" && dish.dietType === "non_veg") {
    isViolation = true;
    penaltyReasons.push("Diet Violation: Contains meat or poultry (Eggetarian rule)");
  }

  // -------------------------------------------------------------
  // 2. ALLERGY VIOLATIONS (STRICTLY ALWAYS RED)
  // -------------------------------------------------------------
  if (profile.allergies && profile.allergies.length > 0) {
    for (const allergy of profile.allergies) {
      if (dish.containsAllergens.includes(allergy)) {
        isViolation = true;
        const formatted = allergy.replace("_", " ").toUpperCase();
        penaltyReasons.push(`Allergy Violation: Contains ${formatted}`);
      }
    }
  }

  // If ANY diet or allergy violation exists -> ALWAYS RED (Score clamped <= 25, Tier: avoid)
  if (isViolation) {
    return {
      score: Math.min(25, Math.max(10, score - 50)),
      tier: "avoid", // RED
      penaltyReasons,
      positiveReasons,
      isViolation: true,
    };
  }

  // -------------------------------------------------------------
  // 3. GOAL-SPECIFIC HEALTH SCORING
  // -------------------------------------------------------------

  // A. FAT LOSS: Prioritize protein per calorie (Protein / Calorie ratio)
  if (profile.goal === "fat_loss") {
    const calories = Math.max(dish.nutrition.calories, 50);
    const protein = dish.nutrition.protein;
    // Protein per 100 calories (grams per 100 kcal)
    const proteinPer100Kcal = (protein / calories) * 100;

    if (proteinPer100Kcal >= 10) {
      // Extremely lean & protein-dense (e.g. tandoori chicken, lean fish, dry paneer bhurji)
      score += 16;
      positiveReasons.push(`High protein density (${proteinPer100Kcal.toFixed(1)}g per 100 kcal)`);
    } else if (proteinPer100Kcal >= 6) {
      score += 8;
      positiveReasons.push("Good protein-to-calorie balance");
    } else if (proteinPer100Kcal < 3.2) {
      // Low protein density, empty calories (e.g. fried breads, heavy gravies)
      score -= 22;
      penaltyReasons.push(`Poor protein density (${proteinPer100Kcal.toFixed(1)}g per 100 kcal)`);
    }

    if (dish.nutrition.calories > 550) {
      score -= 18;
      penaltyReasons.push(`High calorie density (${dish.nutrition.calories} kcal)`);
    }
    if (dish.nutrition.fats > 24) {
      score -= 14;
      penaltyReasons.push(`High fat (${dish.nutrition.fats}g) slows fat loss`);
    }
  }

  // B. DIABETES: Penalize sugar and refined carbs
  else if (profile.goal === "diabetes_friendly") {
    // Check refined carbs (maida, naan, bhature, parathas, fried items)
    const isRefinedCarb =
      nameLower.includes("naan") ||
      nameLower.includes("bhature") ||
      nameLower.includes("kulcha") ||
      nameLower.includes("maida") ||
      nameLower.includes("puri") ||
      nameLower.includes("fried") ||
      dish.containsAllergens.includes("deep_fried");

    if (isRefinedCarb) {
      score -= 28;
      penaltyReasons.push("Refined flour (maida) triggers sharp postprandial glucose spike");
    }

    // Carbs penalty
    if (dish.nutrition.carbs > 45) {
      score -= 24;
      penaltyReasons.push(`High carbohydrate load (${dish.nutrition.carbs}g)`);
    } else if (dish.nutrition.carbs > 25) {
      score -= 10;
      penaltyReasons.push(`Moderate carbs (${dish.nutrition.carbs}g)`);
    } else {
      score += 8;
      positiveReasons.push(`Low carb content (${dish.nutrition.carbs}g) prevents sugar spike`);
    }

    // Sugar penalty
    const sugar = dish.nutrition.sugar ?? 0;
    if (sugar >= 8) {
      score -= 26;
      penaltyReasons.push(`High added/natural sugar (${sugar}g)`);
    } else if (sugar >= 4) {
      score -= 12;
      penaltyReasons.push(`Noticeable sugar content (${sugar}g)`);
    }

    // Fiber reward
    if ((dish.nutrition.fiber || 0) >= 5) {
      score += 10;
      positiveReasons.push(`High dietary fiber (${dish.nutrition.fiber}g) stabilizes glucose`);
    }
  }

  // C. BLOOD PRESSURE (BP / Heart Health): Penalize sodium
  else if (profile.goal === "heart_health") {
    const sodium = dish.nutrition.sodium || 500;

    if (sodium >= 850) {
      score -= 32;
      penaltyReasons.push(`Very high sodium (${sodium}mg): severe hypertension & BP risk`);
    } else if (sodium >= 620) {
      score -= 18;
      penaltyReasons.push(`Elevated sodium (${sodium}mg): limits for blood pressure`);
    } else if (sodium <= 350) {
      score += 10;
      positiveReasons.push(`Heart-friendly low sodium (${sodium}mg)`);
    }

    // High saturated fats / frying oil penalty
    if (dish.nutrition.fats > 22) {
      score -= 14;
      penaltyReasons.push(`High fat (${dish.nutrition.fats}g) adds cardiovascular strain`);
    }
  }

  // D. MUSCLE GAIN: Prioritize absolute protein
  else if (profile.goal === "muscle_gain") {
    if (dish.nutrition.protein >= 28) {
      score += 18;
      positiveReasons.push(`Outstanding protein yield (${dish.nutrition.protein}g)`);
    } else if (dish.nutrition.protein >= 18) {
      score += 10;
      positiveReasons.push(`Solid protein portion (${dish.nutrition.protein}g)`);
    } else if (dish.nutrition.protein < 10) {
      score -= 18;
      penaltyReasons.push(`Insufficient protein (${dish.nutrition.protein}g) for muscle growth`);
    }
  }

  // E. CLEAN EVERYDAY DINING
  else {
    if (dish.nutrition.calories <= 320 && dish.nutrition.fats <= 12) {
      score += 10;
      positiveReasons.push("Light, balanced homestyle preparation");
    }
    if (dish.containsAllergens.includes("deep_fried")) {
      score -= 20;
      penaltyReasons.push("Deep-fried preparation");
    }
  }

  // Clamp final score between 28 and 98
  const finalScore = Math.max(28, Math.min(98, Math.round(score)));

  // Tier assignment: Green (>= 78), Yellow (50 - 77), Red (< 50)
  let tier: "safe" | "moderate" | "avoid" = "moderate"; // Yellow
  if (finalScore >= 78) {
    tier = "safe"; // Green
  } else if (finalScore < 50) {
    tier = "avoid"; // Red
  }

  return {
    score: finalScore,
    tier,
    penaltyReasons,
    positiveReasons,
    isViolation: false,
  };
}
