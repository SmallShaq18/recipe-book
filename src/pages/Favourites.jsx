import React from 'react';
import { useRecipes } from '../hooks/useRecipes.js';
import { useConfirm } from '../hooks/useConfirm.js';
import { RecipeCard } from '../components/recipe/RecipeCard.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { toast } from 'react-toastify';

export default function Favourites() {
  const { favourites, deleteRecipe } = useRecipes();
  const confirm = useConfirm();

  const handleDelete = (recipeId) => {
    confirm.confirm(
      'Delete this recipe? This cannot be undone.',
      () => {
        deleteRecipe(recipeId);
        toast.success('Recipe deleted!');
      }
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: 'inherit'
        }}>
          My Favourites
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--brand-muted)',
          fontStyle: 'italic',
          margin: 0
        }}>
          {favourites.length} recipe{favourites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Empty state */}
      {favourites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--brand-light)',
          borderRadius: 'var(--radius-card)',
          opacity: 0.7
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💔</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
            No favourite recipes yet
          </h2>
          <p style={{ color: 'var(--brand-muted)' }}>
            Heart your favourite recipes to see them displayed here.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {favourites.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancel}
        onClose={confirm.close}
      />
    </div>
  );
}
