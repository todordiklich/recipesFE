# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

Project: CookBook (Recipe Sharing & Meal Planning Platform)

Goal

Build a full-stack recipe platform where users can:
• browse recipes
• save favorites
• create meal plans
• manage ingredients
• leave reviews/comments

The project should practice:
• React architecture
• Express backend structure
• filtering/search
• relational database modeling
• reusable hooks/services
• optimistic updates
• advanced UI state
• authentication & authorization

This should still be realistically finishable in ~8–12 hours.

Core Features
Users can:
• register/login
• browse recipes
• search/filter recipes
• save favorite recipes
• create their own recipes
• comment/review recipes
• build weekly meal plans

⸻

Tech Stack
Frontend
Required:
• React
• React Router
• hooks
• services folder
Recommended:
• TypeScript
• TailwindCSS

⸻

Backend
Required:
• Express
• JWT authentication
• validation middleware
Recommended:
• Prisma
• PostgreSQL

Core Entities
User
Fields:
• id
• email
• username
• passwordHash

Recipe
Fields:
• id
• authorId
• title
• description
• cookingTime
• difficulty
• imageUrl
• createdAt
Difficulties:
• EASY
• MEDIUM
• HARD

Ingredient
Fields:
• id
• recipeId
• name
• quantity

FavoriteRecipe
Fields:
• userId
• recipeId

Comment
Fields:
• id
• recipeId
• authorId
• content
• createdAt

MealPlan
Fields:
• id
• userId
• date
• recipeId

⸻

Frontend Requirements
Authentication
Implement:
• signup/login/logout
• protected routes
• auth persistence

⸻

Advanced Frontend Feature (Important)
Dynamic Recipe Filtering
Users should filter by:
• difficulty
• cooking time
• ingredients
• favorites
This practices:
• derived state
• memoization
• reusable hooks
• debouncing
• query synchronization

⸻

React Architecture
Expected structure:
src/
components/
hooks/
services/
pages/
context/
utils/
Practice:
• reusable hooks
• service layer
• clean component separation

⸻

Backend Requirements
Implement:
• pagination
• filtering/search
• sorting
• centralized error handling
• validation middleware
Expected structure:
routes/
controllers/
services/
middleware/

⸻

Authorization
Users should:
• only edit/delete their own recipes
• only manage their own meal plans
• only modify their own comments

⸻

Nice-to-Have Features
If time remains:
• drag-and-drop meal planning
• shopping list generation
• recipe ratings
• image uploads
• dark mode
• markdown recipe editor

⸻

The project should demonstrate:
• scalable React architecture
• reusable hooks/services
• good relational DB design
• filtering/search thinking
• optimistic updates
• proper auth handling
• clean API structure

⸻

Red Flags
• giant components
• duplicated API logic
• poor loading/error handling
• no pagination
• no authorization checks
• business logic directly inside UI

Deliverables
The final project should include:
• working frontend
• working backend
• authentication
• recipe filtering/search
• meal planning
• relational DB
• clean architecture
• README setup instructions
