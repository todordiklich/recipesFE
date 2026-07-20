import type { MealPlan } from '../types/mealPlan.types';
import { apiRequest } from './client';

export async function getMealPlans(): Promise<MealPlan[]> {
  return apiRequest<MealPlan[]>('/mealPlans', {
    method: 'GET',
  });
}

export async function createMealPlan(recipeId: number, date: string) {
  return apiRequest<MealPlan>('/mealPlans', {
    method: 'POST',
    body: JSON.stringify({ date, recipeId }),
  });
}
