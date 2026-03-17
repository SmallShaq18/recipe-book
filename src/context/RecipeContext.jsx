import React, { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { RECIPES } from '../data/sampleRecipes.js';

const RecipeContext = createContext();
export { RecipeContext };

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useLocalStorage('recipes', RECIPES);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id:         `${Date.now()}-${Math.random()}`,
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

  // ── Extra actions ─────────────────────────────────────────────────────────

  // Toggle favourite — used by RecipeCard heart button
  const toggleFavourite = (id) => {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, favourite: !r.favourite } : r)
    );
  };

  // Set a 1–5 star rating
  const rateRecipe = (id, rating) => {
    if (rating < 1 || rating > 5) return;
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, rating } : r)
    );
  };

  // Increment cook count — call this when user finishes cook mode
  const incrementCookCount = (id) => {
    setRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, cookCount: (r.cookCount || 0) + 1 } : r)
    );
  };

  // ── Derived data (memoised so consumers don't recompute) ──────────────────

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

  // ── Context value ─────────────────────────────────────────────────────────

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

/*import React, { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { RECIPES } from '../data/sampleRecipes.js';

const RecipeContext = createContext();

export { RecipeContext };

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useLocalStorage('recipes', RECIPES);

  const addRecipe = (recipe) => {
    const newRecipe = {
      ...recipe,
      id: `${Date.now()}-${Math.random()}`
    };
    setRecipes([...recipes, newRecipe]);
  };

  const updateRecipe = (id, updatedRecipe) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
    ));
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const value = {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}*/