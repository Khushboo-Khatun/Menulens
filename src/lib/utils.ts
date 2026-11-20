import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMacros(calories: number, protein: number, carbs: number, fats: number) {
  return `${calories} kcal • P: ${protein}g • C: ${carbs}g • F: ${fats}g`;
}
