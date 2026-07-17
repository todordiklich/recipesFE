import { useState } from 'react';
import { type SubmitEvent } from 'react';
import { useParams } from 'react-router';
import { getRecipeById, createComment } from '../api/recipe.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './RecipeDetail.module.css';
import type { Recipe } from '../types/recipe.types';
import { useAuth } from '../context/useAuth';

export default function RecipeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [submitError, setSubmitError] = useState('');
  const {
    data: recipeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id!),
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

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment || !id) {
      return;
    }

    commentMutation.mutate({ recipeId: id, content: trimmedComment });
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{recipeData.title}</h1>
        <div className={styles.meta}>
          <span>⏱ {recipeData.cookingTime} min</span>
          <span>👤 {recipeData.author.name}</span>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Description</h2>
        <p className={styles.description}>{recipeData.description}</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <ul className={styles.list}>
          {recipeData.ingredients.map((ingredient) => (
            <li key={ingredient.name}>
              {ingredient.name} - {ingredient.quantity}
            </li>
          ))}
        </ul>
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
            disabled={commentMutation.isPending}
          >
            {commentMutation.isPending ? 'Posting...' : 'Post comment'}
          </button>
        </form>

        {submitError && <p className={styles.error}>{submitError}</p>}
      </section>
    </div>
  );
}
