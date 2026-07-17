import { createBrowserRouter } from 'react-router';
import App from '../App';
import PageNotFound from '../pages/PageNotFound';
import Login from '../pages/Login';
import ProtectedRoutes from './ProtectedRoutes';
import Recipes from '../pages/Recipes';
import RecipeDetail from '../pages/RecipeDetail';
import Signup from '../pages/Signup';
import Logout from '../pages/Logout';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Public routes
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/logout',
        element: <Logout />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },

      // Protected routes
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/',
            element: <Recipes />,
          },
          {
            path: '/recipeDetail/:id',
            element: <RecipeDetail />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);
