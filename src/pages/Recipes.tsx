import { useQuery } from '@tanstack/react-query';
import { getRecipes } from '../api/recipe.api';
import RecipeList from '../components/RecipeList';

export default function Recipes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipes(),
  });

  return isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>Error loading recipes</p>
  ) : (
    <RecipeList recipes={data?.recipes || []} />
  );
}
