import { useContext } from 'react';
import RecipeContext from '../context/RecipeContext.jsx';

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}

/*import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext.jsx';

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}*/