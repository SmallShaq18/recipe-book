import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext.jsx';
import { useDarkMode } from './hooks/useDarkMode.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './pages/Layout.jsx';

// Pages
import HomePage     from './pages/HomePage.jsx';
import RecipeList   from './pages/RecipeList.jsx';
import Favourites   from './pages/Favourites.jsx';
import MealPlanner  from './pages/MealPlanner.jsx';
import RecipeDetails from './pages/RecipeDetails.jsx';
import AddNewRecipe from './pages/AddNewRecipe.jsx';
import EditRecipe   from './pages/EditRecipe.jsx';
import NoPage       from './pages/NoPage.jsx';
import AddRecipe    from './pages/AddRecipe.jsx';
import { ShoppingList } from './pages/ShoppingList.jsx';

// Global styles
import './styles/tokens.css';
import './styles/global.css';

// ── AppContent ─────────────────────────────────────────────────────────────
// Separated from App so it can access RecipeProvider context if needed later

function AppContent() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    // Removed Bootstrap bg-dark/bg-light/min-vh-100 classes.
    // Background and min-height are now handled by tokens.css + index.css.
    // The dark-mode class on <body> is toggled by useDarkMode directly.
    <div>
      <Routes>
        <Route
          path="/"
          element={<Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
        >
          {/* Home */}
          <Route index element={<HomePage darkMode={darkMode} />} />

          {/* Recipes */}
          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipeList" element={<RecipeList />} />
          <Route path="shopping-list" element={<ShoppingList />} />

          {/* Favourites */}
          <Route path="favourites" element={<Favourites />} />

          {/* Recipe detail */}
          <Route path="recipeDetails/:recipeId" element={<RecipeDetails />} />

          {/* Add / Edit */}
          <Route path="addRecipe" element={<AddNewRecipe />} />
          <Route path="addNewRecipe" element={<AddRecipe />} />
          <Route path="editRecipe/:recipeId" element={<EditRecipe />} />

          {/* Meal planner */}
          <Route path="meal-planner" element={<MealPlanner />} />

          {/* 404 */}
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>

      {/* Single global ToastContainer — don't add more in individual pages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        toastStyle={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-sm)',
        }}
      />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}

/*import { Route, Routes } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext.jsx';
import { useDarkMode } from './hooks/useDarkMode.js';
import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import SmartRecipes from './pages/SmartRecipes.jsx';
import MealPlanner from './pages/MealPlanner.jsx';
import RecipeDetails from './pages/RecipeDetails.jsx';
import AddRecipe from './pages/AddRecipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import NoPage from './pages/NoPage.jsx';
import './styles/global.css';
import './styles/theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <Routes>
        <Route path="/" element={<Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="smart-recipes" element={<SmartRecipes />} />
          <Route path="meal-planner" element={<MealPlanner />} />
          <Route path="recipeDetails/:recipeId" element={<RecipeDetails />} />
          <Route path="addRecipe" element={<AddRecipe />} />
          <Route path="editRecipe/:recipeId" element={<EditRecipe />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}*/
