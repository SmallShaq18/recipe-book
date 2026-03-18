import React, { useMemo } from 'react';
import RecipeContext from './RecipeContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { RECIPES } from '../data/sampleRecipes.js';

// RecipeProvider is in its own file so Vite Fast Refresh is happy.
// Rule: a file that exports a React component must ONLY export React components.
// RecipeContext (a plain object) lives in RecipeContext.jsx instead.

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useLocalStorage('recipes', RECIPES);

  // ── CRUD ────────────────────────────────────────────────────────────────

  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id:        `${Date.now()}-${Math.random()}`,
      favourite:  false,
      rating:     0,
      cookCount:  0,
      createdAt:  Date.now(),
    };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = (id, updatedData) => {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, ...updatedData } : r)
    );
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  // ── Extra actions ────────────────────────────────────────────────────────

  const toggleFavourite = (id) => {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, favourite: !r.favourite } : r)
    );
  };

  const rateRecipe = (id, rating) => {
    if (rating < 1 || rating > 5) return;
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, rating } : r)
    );
  };

  const incrementCookCount = (id) => {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, cookCount: (r.cookCount || 0) + 1 } : r)
    );
  };

  // ── Derived data (memoised) ──────────────────────────────────────────────

  const favourites = useMemo(
    () => recipes.filter(r => r.favourite),
    [recipes]
  );

  const mostCooked = useMemo(
    () => [...recipes].sort((a, b) => (b.cookCount || 0) - (a.cookCount || 0)).slice(0, 6),
    [recipes]
  );

  const topRated = useMemo(
    () => [...recipes].filter(r => r.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 6),
    [recipes]
  );

  // ── Context value ────────────────────────────────────────────────────────

  const value = {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavourite,
    rateRecipe,
    incrementCookCount,
    favourites,
    mostCooked,
    topRated,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export default RecipeProvider;