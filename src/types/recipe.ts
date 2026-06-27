export interface Recipe {
  id: string;
  proteinId: string;
  cookingMethodId: string;
  flavorProfileId: string;
  recipeType: "dry_rub" | "marinade" | "brine";
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  restingTime?: string;
  applyTiming?: string;
  targetTempF?: number;
  woodPairings?: string[];
  sauceRecommendations?: string[];
  sideRecommendations?: string[];
  cookingTips?: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationResult {
  protein: any;
  method: any;
  flavor: any;
  recipes: Record<string, Recipe>;
}
