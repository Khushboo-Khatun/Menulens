import { DishItem, GeminiDishResponse, ScoreTier } from "@/types/dish";
import { AllergyType } from "@/types/profile";

export function mapGeminiDishesToDishItems(
  rawDishes: GeminiDishResponse[]
): DishItem[] {
  return rawDishes.map((raw, idx) => {
    const id = `gemini-dish-${idx + 1}-${Date.now()}`;
    const nameLower = raw.name.toLowerCase();

    // 1. Infer Category
    let category: DishItem["category"] = "Main Curries";
    if (
      nameLower.includes("tikka") ||
      nameLower.includes("tandoori") ||
      nameLower.includes("kebab") ||
      nameLower.includes("starter") ||
      nameLower.includes("bhature") ||
      nameLower.includes("pakora")
    ) {
      category = "Starters & Tandoor";
    } else if (
      nameLower.includes("dal") ||
      nameLower.includes("tadka") ||
      nameLower.includes("makhani") ||
      nameLower.includes("sambar")
    ) {
      category = "Dals & Lentils";
    } else if (
      nameLower.includes("roti") ||
      nameLower.includes("naan") ||
      nameLower.includes("paratha") ||
      nameLower.includes("kulcha") ||
      nameLower.includes("rice") ||
      nameLower.includes("biryani") ||
      nameLower.includes("pulao")
    ) {
      category = "Breads & Rice";
    } else if (
      nameLower.includes("fish") ||
      nameLower.includes("prawn") ||
      nameLower.includes("seafood") ||
      nameLower.includes("crab")
    ) {
      category = "Seafood";
    }

    // 2. Infer Allergens
    const containsAllergens: AllergyType[] = [];
    if (
      nameLower.includes("paneer") ||
      nameLower.includes("butter") ||
      nameLower.includes("makhani") ||
      nameLower.includes("cream") ||
      nameLower.includes("malai") ||
      nameLower.includes("curd") ||
      nameLower.includes("dahi") ||
      nameLower.includes("ghee")
    ) {
      containsAllergens.push("dairy");
    }
    if (
      nameLower.includes("naan") ||
      nameLower.includes("bhature") ||
      nameLower.includes("paratha") ||
      nameLower.includes("roti") ||
      nameLower.includes("kulcha") ||
      nameLower.includes("puri") ||
      nameLower.includes("maida")
    ) {
      containsAllergens.push("gluten");
    }
    if (
      nameLower.includes("kaju") ||
      nameLower.includes("cashew") ||
      nameLower.includes("shahi") ||
      nameLower.includes("korma") ||
      nameLower.includes("nut")
    ) {
      containsAllergens.push("nuts");
    }
    if (
      nameLower.includes("bhature") ||
      nameLower.includes("pakora") ||
      nameLower.includes("puri") ||
      nameLower.includes("fried")
    ) {
      containsAllergens.push("deep_fried");
    }

    // 3. Jain check
    const isJainFriendly =
      raw.is_veg &&
      !nameLower.includes("onion") &&
      !nameLower.includes("garlic") &&
      !nameLower.includes("aloo") &&
      !nameLower.includes("potato") &&
      !nameLower.includes("pyaz") &&
      !nameLower.includes("lehsun");

    // 4. Calculate Objective Health Base Score (0 - 100)
    let score = 88;
    if (raw.calories > 600) score -= 25;
    else if (raw.calories > 450) score -= 15;
    else if (raw.calories < 300) score += 6;

    if (raw.fat > 30) score -= 22;
    else if (raw.fat > 18) score -= 12;
    else if (raw.fat < 8) score += 5;

    if (raw.protein >= 25) score += 8;
    else if (raw.protein < 8 && !category.includes("Breads")) score -= 10;

    if (raw.sodium > 850) score -= 14;

    if (containsAllergens.includes("deep_fried")) score -= 20;

    const baseScore = Math.max(20, Math.min(97, Math.round(score)));
    let scoreTier: ScoreTier = "moderate";
    if (baseScore >= 80) scoreTier = "safe";
    else if (baseScore < 55) scoreTier = "avoid";

    // 5. Generate Pros & WatchOuts
    const pros: string[] = [
      `${raw.protein}g protein per standard portion`,
      raw.is_veg ? "100% vegetarian preparation" : "High biological value animal protein",
    ];
    if (raw.calories <= 320) pros.push(`Calorie conscious pick (${raw.calories} kcal)`);
    if (raw.fat <= 10) pros.push("Low total fat preparation");

    const watchOuts: string[] = [];
    if (raw.fat >= 20) {
      watchOuts.push(`High fat (${raw.fat}g): check for hidden butter or cream floats`);
    }
    if (raw.sodium >= 700) {
      watchOuts.push(`Sodium elevated (${raw.sodium}mg) from restaurant spice mixes`);
    }
    if (containsAllergens.includes("deep_fried")) {
      watchOuts.push("Deep-fried: absorbs significant heated vegetable oil");
    }

    // 6. Hinglish Waiter Prompt
    let hinglishPrompt = "Bhaiya, isme tel aur makkhan thoda kam rakhna please.";
    let englishPrompt = "Please ask the chef to prepare with minimal oil and butter.";

    if (raw.fat > 18) {
      hinglishPrompt =
        "Bhaiya, isme upar se floating cream ya makkhan bilkul mat dalna, gravy light rakhna please.";
      englishPrompt =
        "Please ask the kitchen not to garnish with cream or butter, keeping the gravy light.";
    } else if (category === "Breads & Rice") {
      hinglishPrompt =
        "Bhaiya, roti/naan bilkul dry laana, upar se ghee ya butter bilkul mat lagana.";
      englishPrompt =
        "Please serve the bread completely dry with zero butter or ghee on top.";
    } else if (!raw.is_veg) {
      hinglishPrompt =
        "Bhaiya, pieces par butter brush mat karna, dry roast aur nimbu extra dena please.";
      englishPrompt =
        "Please do not brush melted butter over the pieces, serve dry with extra lemon.";
    }

    // 7. Tags
    const tags: string[] = [];
    if (raw.protein >= 20) tags.push("High Protein");
    if (raw.calories <= 300) tags.push("Low Calorie");
    if (raw.fat <= 8) tags.push("Low Fat");
    if (isJainFriendly) tags.push("Jain Friendly");
    if (raw.is_veg) tags.push("Vegetarian");

    return {
      id,
      name: raw.name,
      category,
      dietType: raw.is_veg ? "veg" : "non_veg",
      isJainFriendly,
      containsAllergens,
      baseScore,
      scoreTier,
      price: raw.price,
      confidence: raw.confidence,
      nutrition: {
        calories: raw.calories,
        protein: raw.protein,
        carbs: raw.carbs,
        fats: raw.fat,
        sugar: raw.sugar,
        sodium: raw.sodium,
        estimatedOilTbsp: Math.max(0.5, Math.round((raw.fat / 14) * 10) / 10),
      },
      description: raw.reason,
      healthVerdict: raw.reason,
      pros,
      watchOuts,
      healthierSwap: raw.swap
        ? {
            dishName: "Recommended Alternative",
            savings: "Healthier Swap",
            description: raw.swap,
          }
        : undefined,
      waiterScript: {
        hinglish: hinglishPrompt,
        english: englishPrompt,
      },
      tags,
    };
  });
}
