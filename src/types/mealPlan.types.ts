import type { User } from './auth.types';
import type { Recipe } from './recipe.types';

export interface MealPlan {
  id: number;
  userId?: number;
  date: string;
  recipeId?: number;
  user: User;
  recipe: Recipe;
}
