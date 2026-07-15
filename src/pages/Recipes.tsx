import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '../api/recipe.api';

export default function Recipes() {
  const { data } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipes(),
  });

  return (
    <ul>
      {data?.recipes?.map((recipe) => (
        <li key={recipe.id}>{recipe.title}</li>
      ))}
    </ul>
  );
}
