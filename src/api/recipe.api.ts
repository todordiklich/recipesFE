import type { Difficulty, ApiRecipesResponse } from '../types/recipe.types';
import { apiRequest } from './client';

export async function getRecipes(
  page: number = 1,
  limit: number = 15,
  title: string = '',
  difficulty?: Difficulty,
): Promise<ApiRecipesResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    title,
  });

  if (difficulty) {
    query.set('difficulty', difficulty);
  }

  return apiRequest<ApiRecipesResponse>(`/recipes?${query.toString()}`, {
    method: 'GET',
  });
}
