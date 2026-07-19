import { useState, type SubmitEvent } from 'react';
import Button from './Button';
import styles from './CreateRecipeModal.module.css';
import type { Difficulty, Ingredient } from '../types/recipe.types';

interface CreateRecipeModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (payload: {
    title: string;
    description: string;
    cookingTime?: number;
    difficulty: Difficulty;
    imageUrl: string;
    ingredients: Ingredient[];
  }) => Promise<void> | void;
}

export default function CreateRecipeModal({
  isOpen,
  isSubmitting,
  onClose,
  onCreate,
}: CreateRecipeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState('');

  function resetForm() {
    setTitle('');
    setDescription('');
    setCookingTime('');
    setDifficulty('EASY');
    setIngredientName('');
    setIngredientQuantity('');
    setIngredients([]);
    setError('');
  }

  function addIngredient() {
    const name = ingredientName.trim();
    const quantity = ingredientQuantity.trim();

    if (!name || !quantity) {
      setError('Ingredient name and quantity are required.');
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
    setError('');
  }

  function removeIngredient(index: number) {
    setIngredients((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        cookingTime: Number(cookingTime) || undefined,
        difficulty,
        imageUrl: '',
        ingredients,
      });

      resetForm();
      onClose();
    } catch {
      setError('Unable to create recipe right now.');
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Create a new recipe</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className={styles.ingredientsSection}>
            <label className={styles.label}>Ingredients</label>
            <div className={styles.ingredientInputs}>
              <input
                className={styles.input}
                placeholder="Ingredient name"
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
                type="button"
                className={styles.addButton}
                onClick={addIngredient}
              >
                Add
              </button>
            </div>

            {ingredients.length > 0 && (
              <ul className={styles.ingredientsList}>
                {ingredients.map((ingredient, index) => (
                  <li
                    key={`${ingredient.name}-${index}`}
                    className={styles.ingredientItem}
                  >
                    <span>
                      {ingredient.name} — {ingredient.quantity}
                    </span>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeIngredient(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className={styles.label}>
            Cooking time (minutes)
            <input
              className={styles.input}
              type="number"
              min="1"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
            />
          </label>

          <label className={styles.label}>
            Difficulty
            <select
              className={styles.select}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
