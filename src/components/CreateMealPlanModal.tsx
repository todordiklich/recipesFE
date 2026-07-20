import Button from './Button';
import styles from './CreateMealPlanModal.module.css';
import { useState, type SubmitEvent } from 'react';

interface CreateMealPlanModalProps {
  id: number;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (payload: {
    recipeId: number;
    date: string;
  }) => Promise<void> | void;
}

export default function CreateMealPlanModal({
  id,
  isOpen,
  isSubmitting,
  onClose,
  onCreate,
}: CreateMealPlanModalProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await onCreate({
        recipeId: id,
        date: date?.toISOString().split('T')[0] ?? '',
      });

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
            Date
            <input
              type="date"
              className={styles.input}
              value={date ? date.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                setDate(e.target.value ? new Date(e.target.value) : null);
              }}
              required
            />
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
