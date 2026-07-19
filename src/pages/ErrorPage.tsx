import { useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong</h1>
      <h2>
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </h2>
    </div>
  );
}
