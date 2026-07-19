import type {
  Difficulty,
  ApiRecipesResponse,
  Comment,
  Recipe,
  ApiFavouriteRecipeResponse,
} from '../types/recipe.types';
import { apiRequest } from './client';

export async function getRecipes(
  page: number = 1,
  limit: number = 15,
  title: string = '',
  difficulty?: Difficulty,
  cookingTime?: number,
  ingredient?: string,
  favorites?: boolean,
): Promise<ApiRecipesResponse> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    title,
  });

  if (difficulty) {
    query.set('difficulty', difficulty);
  }

  if (cookingTime !== undefined) {
    query.set('cookingTime', String(cookingTime));
  }

  if (ingredient) {
    query.set('ingredients', ingredient);
  }

  if (favorites) {
    query.set('favorites', String(favorites));
  }

  return apiRequest<ApiRecipesResponse>(`/recipes?${query.toString()}`, {
    method: 'GET',
  });
}

export async function getRecipeById(id: string): Promise<Recipe> {
  return apiRequest<Recipe>(`/recipes/${id}`, {
    method: 'GET',
  });
}

export async function createRecipe(payload: Partial<Recipe>): Promise<Recipe> {
  return apiRequest<Recipe>('/recipes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateRecipe(
  id: string,
  payload: Partial<Recipe>,
): Promise<Recipe> {
  return apiRequest<Recipe>(`/recipes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function createComment(
  id: string,
  content: string,
): Promise<Comment> {
  return apiRequest<Comment>(`/recipes/${id}/comment`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function favouriteRecipe(
  id: string,
): Promise<ApiFavouriteRecipeResponse> {
  return apiRequest<ApiFavouriteRecipeResponse>(`/recipes/favourite/${id}`, {
    method: 'GET',
  });
}

export async function addToFavourites(
  id: string,
): Promise<ApiFavouriteRecipeResponse> {
  return apiRequest<ApiFavouriteRecipeResponse>(
    `/recipes/addToFavourites/${id}`,
    {
      method: 'POST',
    },
  );
}
