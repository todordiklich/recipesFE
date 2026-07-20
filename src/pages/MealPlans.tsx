import { useQuery } from '@tanstack/react-query';
import { getMealPlans } from '../api/mealPlan.api';
import type { MealPlan } from '../types/mealPlan.types';
import { Link } from 'react-router';
import styles from './MealPlan.module.css';

export default function MealPlans() {
  const { data } = useQuery<MealPlan[]>({
    queryKey: ['mealPlan'],
    queryFn: () => getMealPlans(),
  });

  return (
    <div>
      <h1>Meal Plans</h1>

      <div className={styles.mealPlansContainer}>
        {data?.map((plan) => (
          <Link
            className={styles.mealPlanItem}
            key={plan.id}
            to={`/recipeDetail/${plan.recipe.id}`}
          >
            Date:{plan.date.split('T')[0]} <br /> Recipe:{plan.recipe.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
