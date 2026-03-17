import React, { useState, useMemo } from 'react';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeGrid } from '../components/recipe/RecipeGrid.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';

export default function SmartRecipes() {
  const { recipes } = useRecipes();
  const [ingredients, setIngredients] = useState('');

  const matchingRecipes = useMemo(() => {
    if (!ingredients.trim()) return [];

    const ingredientList = ingredients
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(i => i.length > 0);

    if (ingredientList.length === 0) return [];

    return recipes.filter(recipe =>
      ingredientList.every(ingredient =>
        recipe.ingredients.some(recipeIngredient =>
          recipeIngredient.toLowerCase().includes(ingredient)
        )
      )
    );
  }, [recipes, ingredients]);

  const handleEdit = (recipe) => {
    // Navigate to edit page or open modal
    console.log('Edit recipe:', recipe);
  };

  const handleDelete = (recipeId) => {
    // Handle delete with confirmation
    console.log('Delete recipe:', recipeId);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">🍳 Cook With What You Have</h1>
          <p className="text-center text-muted mb-4">
            Enter ingredients you have on hand, and we'll suggest recipes you can make!
          </p>

          <div className="row justify-content-center mb-4">
            <div className="col-md-8 col-lg-6">
              <SearchBar
                placeholder="Enter ingredients (comma separated): e.g., chicken, garlic, rice"
                value={ingredients}
                onChange={setIngredients}
                className="smart-search"
              />
            </div>
          </div>

          {ingredients.trim() && (
            <div className="text-center mb-4">
              <h5>
                {matchingRecipes.length === 0
                  ? "No recipes found with those ingredients 😔"
                  : `Found ${matchingRecipes.length} recipe${matchingRecipes.length === 1 ? '' : 's'}!`
                }
              </h5>
            </div>
          )}

          <RecipeGrid
            recipes={matchingRecipes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}