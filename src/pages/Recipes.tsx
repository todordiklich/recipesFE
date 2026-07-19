import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRecipe, getRecipes } from '../api/recipe.api';
import RecipeList from '../components/RecipeList';
import Button from '../components/Button';
import CreateRecipeModal from '../components/CreateRecipeModal';
import styles from './Recipes.module.css';
import type { Ingredient, Recipe } from '../types/recipe.types';

export default function Recipes() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['recipes', page],
    queryFn: () => getRecipes(page),
  });

  const createRecipeMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (newRecipe) => {
      queryClient.setQueryData<{ recipes?: Recipe[] }>(
        ['recipes', page],
        (oldData) => ({
          ...oldData,
          recipes: [newRecipe, ...(oldData?.recipes ?? [])],
        }),
      );
    },
  });

  async function handleCreateRecipe(payload: {
    title: string;
    description: string;
    cookingTime?: number;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    imageUrl: string;
    ingredients: Ingredient[];
  }) {
    await createRecipeMutation.mutateAsync(payload);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recipes</h1>
        <Button
          variant="primary"
          size="large"
          onClick={() => setIsModalOpen(true)}
        >
          Create new recipe
        </Button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : queryError ? (
        <p>Error loading recipes</p>
      ) : (
        <>
          <RecipeList recipes={data?.recipes || []} />
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className={styles.pageInfo}>Page {page}</span>
            <Button
              variant="secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data?.pages ? data?.pages < page : false}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <button className={styles.fab} onClick={() => setIsModalOpen(true)}>
        + New recipe
      </button>

      <CreateRecipeModal
        isOpen={isModalOpen}
        isSubmitting={createRecipeMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRecipe}
      />
    </div>
  );
}
