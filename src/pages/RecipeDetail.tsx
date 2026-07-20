import { useState } from 'react';
import { type SubmitEvent } from 'react';
import { useParams } from 'react-router';
import {
  getRecipeById,
  createComment,
  updateRecipe,
  favouriteRecipe,
  addToFavourites,
} from '../api/recipe.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './RecipeDetail.module.css';
import type { Difficulty, Ingredient, Recipe } from '../types/recipe.types';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { createMealPlan } from '../api/mealPlan.api';
import CreateMealPlanModal from '../components/CreateMealPlanModal';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [editError, setEditError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: recipeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id!),
  });

  const { data: favouriteData } = useQuery({
    queryKey: ['favourite', id],
    queryFn: () => favouriteRecipe(id!),
  });

  const favouriteMutation = useMutation({
    mutationFn: (recipeId: string) => addToFavourites(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favourite', id] });
    },
    onError: () => {
      setSubmitError('Unable to update favourite status right now.');
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({
      recipeId,
      content,
    }: {
      recipeId: string;
      content: string;
    }) => createComment(recipeId, content),
    onSuccess: (createdComment, { recipeId }) => {
      queryClient.setQueryData<Recipe>(['recipe', recipeId], (oldRecipe) => {
        if (!oldRecipe) {
          return;
        }

        return {
          ...oldRecipe,
          comments: [createdComment, ...(oldRecipe.comments ?? [])],
        };
      });

      setCommentText('');
      setSubmitError('');
    },
    onError: () => {
      setSubmitError('Unable to save your comment right now.');
    },
  });

  const updateRecipeMutation = useMutation({
    mutationKey: ['recipe', id],
    mutationFn: ({
      recipeId,
      payload,
    }: {
      recipeId: string;
      payload: Partial<Recipe>;
    }) => updateRecipe(recipeId, payload),
    onSuccess: (updatedRecipe, { recipeId }) => {
      queryClient.setQueryData<Recipe>(
        ['recipe', recipeId],
        (currentRecipe) => {
          if (!currentRecipe) {
            return updatedRecipe;
          }

          return {
            ...currentRecipe,
            ...updatedRecipe,
            ingredients:
              updatedRecipe.ingredients ?? currentRecipe.ingredients ?? [],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['recipe', recipeId] });
      setTitle(updatedRecipe.title);
      setDescription(updatedRecipe.description ?? '');
      setCookingTime(updatedRecipe.cookingTime?.toString() ?? '');
      setDifficulty(updatedRecipe.difficulty);
      setIngredients(updatedRecipe.ingredients ?? []);
      setIsEditing(false);
      setEditError('');
    },
    onError: () => {
      setEditError('Unable to update the recipe right now.');
    },
  });

  const createMealPlanMutation = useMutation({
    mutationFn: ({ recipeId, date }: { recipeId: number; date: string }) =>
      createMealPlan(recipeId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
    },
    onError: () => {
      setSubmitError('Unable to update favourite status right now.');
    },
  });

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment || !id) {
      return;
    }

    commentMutation.mutate({ recipeId: id, content: trimmedComment });
  }

  function handleAddIngredient() {
    const name = ingredientName.trim();
    const quantity = ingredientQuantity.trim();

    if (!name || !quantity) {
      setEditError('Ingredient name and quantity are required.');
      return;
    }

    setIngredients((current) => {
      const normalized = current.filter(
        (ingredient) =>
          !(
            ingredient.name.toLowerCase() === name.toLowerCase() &&
            ingredient.quantity.toLowerCase() === quantity.toLowerCase()
          ),
      );

      return [...normalized, { name, quantity }];
    });
    setIngredientName('');
    setIngredientQuantity('');
    setEditError('');
  }

  function handleRemoveIngredient(index: number) {
    setIngredients((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function handleSaveRecipe() {
    if (!id || !title.trim() || !description.trim()) {
      setEditError('Title and description are required.');
      return;
    }

    const existingIngredients = (recipeData?.ingredients ?? []).map((ing) => ({
      name: ing.name.trim().toLowerCase(),
      quantity: ing.quantity.trim().toLowerCase(),
    }));

    const normalizedIngredients = ingredients.reduce<Ingredient[]>(
      (acc, ingredient) => {
        const name = ingredient.name.trim();
        const quantity = ingredient.quantity.trim();

        if (!name || !quantity) {
          return acc;
        }

        const nameLower = name.toLowerCase();
        const quantityLower = quantity.toLowerCase();

        const alreadyInRecipe = existingIngredients.some(
          (item) => item.name === nameLower && item.quantity === quantityLower,
        );

        if (alreadyInRecipe) {
          return acc;
        }

        const existsInAcc = acc.some(
          (item) =>
            item.name.toLowerCase() === nameLower &&
            item.quantity.toLowerCase() === quantityLower,
        );

        if (!existsInAcc) {
          acc.push({ name, quantity });
        }

        return acc;
      },
      [],
    );

    updateRecipeMutation.mutate({
      recipeId: id,
      payload: {
        title: title.trim(),
        description: description.trim(),
        cookingTime: Number(cookingTime) || undefined,
        difficulty,
        ingredients: normalizedIngredients,
      },
    });
  }

  function handleStartEditing() {
    if (!recipeData) {
      return;
    }

    setTitle(recipeData.title ?? '');
    setDescription(recipeData.description ?? '');
    setCookingTime(recipeData.cookingTime?.toString() ?? '');
    setDifficulty(recipeData.difficulty ?? 'EASY');
    setIngredients(
      (recipeData.ingredients ?? []).map((ingredient) => ({
        name: ingredient.name.trim(),
        quantity: ingredient.quantity.trim(),
      })),
    );
    setIngredientName('');
    setIngredientQuantity('');
    setEditError('');
    setIsEditing(true);
  }

  async function handleCreateMealPlan(payload: {
    recipeId: number;
    date: string;
  }) {
    await createMealPlanMutation.mutateAsync(payload);
  }

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.loading}>Error loading recipe</p>;
  }

  if (!recipeData) {
    return <p className={styles.notFound}>Recipe not found</p>;
  }

  const isCreator = user?.user?.id === recipeData.author?.id;

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        {favouriteData ? (
          <Button onClick={() => favouriteMutation.mutate(id!)}>
            Remove from Favourites
          </Button>
        ) : (
          <Button onClick={() => favouriteMutation.mutate(id!)}>
            Add to Favourites
          </Button>
        )}
        <Button onClick={() => setIsModalOpen(true)}>Create Meal Plan</Button>
      </div>
      <header className={styles.header}>
        {isEditing ? (
          <div className={styles.editHeader}>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className={styles.metaEdit}>
              <label className={styles.label}>
                ⏱
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                />
                min
              </label>
              <label className={styles.label}>
                🚩
                <select
                  className={styles.input}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </label>
              <span>👤 {recipeData.author.name}</span>
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.title}>{recipeData.title}</h1>
            <div className={styles.meta}>
              <span>⏱ {recipeData.cookingTime} min</span>
              <span>👤 {recipeData.author.name}</span>
              <span>🚩 {recipeData.difficulty}</span>
            </div>
          </>
        )}
      </header>

      {isCreator && (
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button
                className={styles.submitButton}
                onClick={handleSaveRecipe}
                disabled={updateRecipeMutation.isPending}
              >
                {updateRecipeMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <Button onClick={handleStartEditing}>Edit recipe</Button>
          )}
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Description</h2>
        {isEditing ? (
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        ) : (
          <p className={styles.description}>{recipeData.description}</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        {isEditing ? (
          <div className={styles.ingredientsEditor}>
            <div className={styles.ingredientInputs}>
              <input
                className={styles.input}
                placeholder="Ingredient"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Quantity"
                value={ingredientQuantity}
                onChange={(e) => setIngredientQuantity(e.target.value)}
              />
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={handleAddIngredient}
              >
                Add
              </button>
            </div>
            <ul className={styles.list}>
              {ingredients.map((ingredient, index) => (
                <li
                  key={`${ingredient.name}-${index}`}
                  className={styles.ingredientItem}
                >
                  <span>
                    {ingredient.name} - {ingredient.quantity}
                  </span>
                  <button
                    className={styles.removeButton}
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className={styles.list}>
            {recipeData.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                {ingredient.name} - {ingredient.quantity}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Comments</h2>

        {(recipeData.comments ?? []).map((comment) => {
          const authorName = comment.author?.name ?? user?.user.name;
          const createdDate =
            comment.createdAt?.split('T')[0] ?? 'Unknown date';

          return (
            <div key={comment.id} className={styles.commentCard}>
              <p>{comment.content}</p>
              <p className={styles.commentMeta}>
                {authorName} - {createdDate}
              </p>
            </div>
          );
        })}

        <CreateMealPlanModal
          id={Number(id!)}
          isOpen={isModalOpen}
          isSubmitting={createMealPlanMutation.isPending}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateMealPlan}
        />

        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
          />
          <button
            className={styles.submitButton}
            type="submit"
            disabled={commentMutation.isPending || commentText.trim() === ''}
          >
            {commentMutation.isPending ? 'Posting...' : 'Post comment'}
          </button>
        </form>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </section>

      {editError && <p className={styles.error}>{editError}</p>}
    </div>
  );
}
