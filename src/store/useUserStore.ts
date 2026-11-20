import { create } from "zustand";
import { UserProfile, HealthGoal, DietType, AllergyType } from "@/types/profile";

interface UserState {
  profile: UserProfile;
  setGoal: (goal: HealthGoal) => void;
  setDiet: (diet: DietType) => void;
  toggleAllergy: (allergy: AllergyType) => void;
  setStrictMode: (strict: boolean) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Health Seeker",
  goal: "fat_loss",
  diet: "pure_veg",
  allergies: [],
  strictMode: false,
  isOnboarded: false,
};

export const useUserStore = create<UserState>((set) => ({
  profile: {
    ...DEFAULT_PROFILE,
    // Attempt local storage hydration safely on client
    isOnboarded: typeof window !== "undefined" ? localStorage.getItem("menulens_onboarded") === "true" : false,
  },
  setGoal: (goal) =>
    set((state) => ({
      profile: { ...state.profile, goal },
    })),
  setDiet: (diet) =>
    set((state) => ({
      profile: { ...state.profile, diet },
    })),
  toggleAllergy: (allergy) =>
    set((state) => {
      const exists = state.profile.allergies.includes(allergy);
      const allergies = exists
        ? state.profile.allergies.filter((a) => a !== allergy)
        : [...state.profile.allergies, allergy];
      return { profile: { ...state.profile, allergies } };
    }),
  setStrictMode: (strictMode) =>
    set((state) => ({
      profile: { ...state.profile, strictMode },
    })),
  completeOnboarding: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("menulens_onboarded", "true");
    }
    set((state) => ({
      profile: { ...state.profile, isOnboarded: true },
    }));
  },
  resetProfile: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("menulens_onboarded");
    }
    set({ profile: DEFAULT_PROFILE });
  },
}));
