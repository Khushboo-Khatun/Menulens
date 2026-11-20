export type HealthGoal =
  | "fat_loss"
  | "muscle_gain"
  | "diabetes_friendly"
  | "heart_health"
  | "clean_eating";

export type DietType =
  | "pure_veg"
  | "eggetarian"
  | "non_veg"
  | "jain"
  | "vegan"
  | "sattvic";

export type AllergyType =
  | "dairy"
  | "gluten"
  | "nuts"
  | "soy"
  | "deep_fried";

export interface UserProfile {
  name: string;
  goal: HealthGoal;
  diet: DietType;
  allergies: AllergyType[];
  targetCaloriesPerMeal?: number;
  strictMode: boolean;
  isOnboarded: boolean;
}

export interface DiningMember {
  id: string;
  name: string;
  diet: DietType;
  allergies: AllergyType[];
  goal: HealthGoal;
  avatarColor: string;
}
