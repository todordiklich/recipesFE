export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt?: string;
  author?: User;
}

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  cookingTime?: number;
  difficulty: Difficulty;
  imageUrl: string;
  author: User;
  ingredients: Ingredient[];
  comments?: Comment[];
}

export interface ApiRecipesResponse {
  recipes?: Recipe[];
  pages?: number;
}
