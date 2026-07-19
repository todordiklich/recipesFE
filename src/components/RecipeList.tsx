import type { Recipe } from '../types/recipe.types';
import RecipeItem from './RecipeItem';
import styles from './RecipeList.module.css';

export default function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <div>
      <ul className={styles.listContainer}>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </ul>
    </div>
  );
}
