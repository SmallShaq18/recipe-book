import React, { useMemo } from 'react';
import { RecipeCard } from './RecipeCard.jsx';
import { filterRecipes } from '../../utils/recipeUtils.js';

export function RecipeGrid({ recipes, searchTerm, selectedCategory, onEdit, onDelete }) {
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, searchTerm, selectedCategory);
  }, [recipes, searchTerm, selectedCategory]);

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No recipes found</h3>
        <p>Try adjusting your search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid">
      {filteredRecipes.map(recipe => (
        <div key={recipe.id} className="recipe-grid-item">
          <RecipeCard
            recipe={recipe}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}