import type { Recipe } from '../types/recipe.types';
import { Link } from 'react-router';
import styles from './RecipeItem.module.css';
import dishDefaultImg from '../assets/dish.svg';

export default function RecipeItem({ recipe }: { recipe: Recipe }) {
  return (
    <li className={styles.cardWrapper}>
      <img
        className={styles.image}
        src={recipe.imageUrl ? recipe.imageUrl : dishDefaultImg}
        alt={recipe.title}
      />
      <div className={styles.card}>
        <Link className={styles.title} to={`/recipeDetail/${recipe.id}`}>
          {recipe.title}
        </Link>
        <p className={styles.description}> {recipe.description}</p>
        <p className={styles.cookingTime}>
          Cooking time: {recipe.cookingTime} min
        </p>
      </div>
    </li>
  );
}
