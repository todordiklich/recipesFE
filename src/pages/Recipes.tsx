import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { createRecipe, getRecipes } from '../api/recipe.api';
import RecipeList from '../components/RecipeList';
import Button from '../components/Button';
import CreateRecipeModal from '../components/CreateRecipeModal';
import styles from './Recipes.module.css';
import type {
  ApiRecipesResponse,
  Ingredient,
  Difficulty,
  Recipe,
  RecipeFilters,
} from '../types/recipe.types';

const defaultFilters: RecipeFilters = {
  title: '',
  difficulty: 'ALL',
  cookingTime: '',
  ingredientFilter: '',
  showOnlyFavorites: false,
};

type UrlRecipeFilters = RecipeFilters;

function parseFiltersFromSearchParams(
  params: URLSearchParams,
): UrlRecipeFilters {
  const difficulty = params.get('difficulty');
  return {
    title: params.get('title') ?? '',
    difficulty:
      difficulty === 'EASY' || difficulty === 'MEDIUM' || difficulty === 'HARD'
        ? difficulty
        : 'ALL',
    cookingTime: params.get('cookingTime') ?? '',
    ingredientFilter: params.get('ingredientFilter') ?? '',
    showOnlyFavorites: params.get('showOnlyFavorites') === 'true',
  };
}

function buildSearchParams(filters: RecipeFilters, page: number) {
  const searchParams = new URLSearchParams();

  if (filters.title.trim()) searchParams.set('title', filters.title.trim());
  if (filters.difficulty !== 'ALL')
    searchParams.set('difficulty', filters.difficulty);
  if (filters.cookingTime.trim())
    searchParams.set('cookingTime', filters.cookingTime.trim());
  if (filters.ingredientFilter.trim())
    searchParams.set('ingredientFilter', filters.ingredientFilter.trim());
  if (filters.showOnlyFavorites) searchParams.set('showOnlyFavorites', 'true');

  searchParams.set('page', String(page));
  return searchParams;
}

export default function Recipes() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = parseFiltersFromSearchParams(searchParams);
  const currentPage = Math.max(Number(searchParams.get('page')) || 1, 1);
  const [draftFilters, setDraftFilters] = useState<RecipeFilters>(urlFilters);

  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<ApiRecipesResponse>({
    queryKey: [
      'recipes',
      currentPage,
      urlFilters.title,
      urlFilters.difficulty,
      urlFilters.cookingTime,
      urlFilters.ingredientFilter,
      urlFilters.showOnlyFavorites,
    ],
    queryFn: () =>
      getRecipes(
        currentPage,
        15,
        urlFilters.title.trim() || undefined,
        urlFilters.difficulty !== 'ALL' ? urlFilters.difficulty : undefined,
        urlFilters.cookingTime.trim()
          ? Number(urlFilters.cookingTime)
          : undefined,
        urlFilters.ingredientFilter.trim() || undefined,
        urlFilters.showOnlyFavorites || undefined,
      ),
  });

  const createRecipeMutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (newRecipe) => {
      queryClient.setQueryData<{ recipes?: Recipe[] }>(
        ['recipes', currentPage],
        (oldData) => ({
          ...oldData,
          recipes: [newRecipe, ...(oldData?.recipes ?? [])],
        }),
      );
    },
  });

  function handleClearFilters() {
    setDraftFilters(defaultFilters);
  }

  function handleSearch() {
    setSearchParams(buildSearchParams(draftFilters, 1), { replace: false });
  }

  function handlePageChange(newPage: number) {
    const nextPage = Math.max(newPage, 1);
    setSearchParams(buildSearchParams(urlFilters, nextPage), {
      replace: false,
    });
  }

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

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <label className={styles.filterLabel}>
            Title
            <input
              className={styles.filterInput}
              type="text"
              value={draftFilters.title}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Recipe title"
            />
          </label>

          <label className={styles.filterLabel}>
            Difficulty
            <select
              className={styles.filterInput}
              value={draftFilters.difficulty}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  difficulty: e.target.value as 'ALL' | Difficulty,
                }))
              }
            >
              <option value="ALL">All</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>

          <label className={styles.filterLabel}>
            Cooking time
            <input
              className={styles.filterInput}
              type="number"
              min={0}
              value={draftFilters.cookingTime}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  cookingTime: e.target.value,
                }))
              }
              placeholder="Minutes"
            />
          </label>

          <label className={styles.filterLabel}>
            Ingredients
            <input
              className={styles.filterInput}
              type="text"
              value={draftFilters.ingredientFilter}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  ingredientFilter: e.target.value,
                }))
              }
              placeholder="Search ingredients"
            />
          </label>

          <label className={styles.filterCheckbox}>
            <input
              type="checkbox"
              checked={draftFilters.showOnlyFavorites}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  showOnlyFavorites: e.target.checked,
                }))
              }
            />
            Favorites only
          </label>
        </div>
        <div className={styles.filterActions}>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear filters
          </Button>
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {data?.pages ? data?.pages + 1 : 1}
            </span>
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data?.pages || currentPage > data.pages}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <CreateRecipeModal
        isOpen={isModalOpen}
        isSubmitting={createRecipeMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateRecipe}
      />
    </div>
  );
}
