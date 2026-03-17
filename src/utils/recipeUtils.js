// ── ID generation ─────────────────────────────────────────────────────────

export function generateRecipeId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ── Validation ────────────────────────────────────────────────────────────

export function validateRecipe(recipe) {
  const errors = [];

  if (!recipe.name?.trim()) {
    errors.push('Recipe name is required');
  }

  // Filter out blank entries before checking length
  const ingredients  = (recipe.ingredients  || []).filter(i => i.trim());
  const instructions = (recipe.instructions || []).filter(i => i.trim());

  if (ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  }
  if (instructions.length === 0) {
    errors.push('At least one instruction is required');
  }
  if (!recipe.category) {
    errors.push('Category is required');
  }

  return errors;
}

// ── filterRecipes ─────────────────────────────────────────────────────────
// Kept for any legacy callers. RecipeList.jsx now filters inline with useMemo
// so this is no longer the primary path, but it's safe to leave here.

export function filterRecipes(recipes, searchTerm, category) {
  return recipes.filter(recipe => {
    const matchesSearch =
      !searchTerm ||
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipe.ingredients || []).some(ing =>
        ing.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      !category || category === 'all' || category === 'All' ||
      recipe.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });
}