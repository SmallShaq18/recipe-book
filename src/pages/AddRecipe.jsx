import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeForm } from '../components/recipe/RecipeForm.jsx';

export default function AddRecipe() {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();

  const handleSubmit = (recipeData) => {
    addRecipe(recipeData);
  };

  const handleCancel = () => {
    navigate('/recipes');
  };

  return (
    <div className="container py-4">
      <RecipeForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}