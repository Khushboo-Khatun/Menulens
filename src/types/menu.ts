import { DishItem } from "./dish";

export interface ScannedMenuResult {
  restaurantName: string;
  scannedAt: string;
  totalDishesFound: number;
  dishes: DishItem[];
  imageUrl?: string;
}
