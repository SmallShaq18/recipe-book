import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeForm } from '../components/recipe/RecipeForm.jsx';

export default function EditRecipe() {
  const { recipeId } = useParams();
  const { recipes, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center p-5 rounded-4 shadow-sm bg-body-tertiary border">
          <i className="bi bi-search display-1 text-secondary opacity-25 mb-4 d-block"></i>
          <h2 className="fw-bold text-body">Recipe not found</h2>
          <p className="text-secondary mb-4">The recipe you're looking for might have been moved or deleted.</p>
          <button 
            className="btn btn-primary rounded-pill px-4 shadow-sm" 
            onClick={() => navigate('/recipes')}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (recipeData) => {
    updateRecipe(recipeId, recipeData);
    // Success handling usually happens inside the hook/form, 
    // but the UI transition feels better here.
  };

  const handleCancel = () => {
    navigate('/recipes');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          
          {/* --- BREADCRUMB NAVIGATION --- */}
          <nav className="mb-4">
            <Link 
              to="/recipes" 
              className="text-decoration-none d-inline-flex align-items-center text-secondary link-primary transition-all"
            >
              <i className="bi bi-chevron-left me-1 small"></i>
              <span className="small fw-medium uppercase tracking-wider">Back to Recipes</span>
            </Link>
          </nav>

          {/* --- HEADER SECTION --- */}
          <header className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="bg-danger bg-opacity-10 p-3 rounded-4 shadow-sm">
                <i className="bi bi-pencil-square fs-3 text-primary"></i>
              </div>
              <div>
                <h1 className="display-6 fw-bold mb-0">Edit Recipe</h1>
                <p className="text-secondary mb-0">Refining <span className=" fw-medium">"{recipe.name}"</span></p>
              </div>
            </div>
          </header>

          {/* --- FORM CONTAINER --- */}
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <RecipeForm
                mode="edit"
                recipe={recipe}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          </div>

          {/* --- HELPER FOOTER --- */}
          <footer className="mt-4 text-center">
            <p className="small text-secondary opacity-50">
              <i className="bi bi-shield-check me-1"></i>
              Changes are saved locally to your device
            </p>
          </footer>

        </div>
      </div>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .transition-all { transition: all 0.2s ease; }
        
        /* Smooth scale-in animation for the form card */
        .card {
          animation: slideUp 0.4s ease-out;
          background: transparent;
          
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Custom focus for the back link */
        .link-primary:hover {
          color: var(--bs-primary) !important;
          transform: translateX(-3px);
        }
      `}</style>
    </div>
  );
}

/*import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeForm } from '../components/recipe/RecipeForm.jsx';

export default function EditRecipe() {
  const { recipeId } = useParams();
  const { recipes, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  const recipe = recipes.find(r => r.id === recipeId);

  if (!recipe) {
    return (
      <div className="er-notfound">
        <h2 className="er-notfound-title">Recipe not found</h2>
        <button className="er-back-btn" onClick={() => navigate('/recipes')}>
          ← Back to recipes
        </button>
        <style>{`
          .er-notfound {
            text-align: center;
            padding: 80px 24px;
          }
          .er-notfound-title {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 500;
            margin-bottom: 20px;
          }
          .er-back-btn {
            padding: 10px 24px;
            border: 0.5px solid rgba(150, 80, 30, 0.2);
            border-radius: var(--radius-pill);
            background: transparent;
            font-family: var(--font-body);
            font-size: 0.875rem;
            color: var(--brand);
            cursor: pointer;
            transition: background var(--transition-fast);
          }
          .er-back-btn:hover { background: var(--brand-light); }
        `}</style>
      </div>
    );
  }

  const handleSubmit = (recipeData) => {
    updateRecipe(recipeId, recipeData);
  };

  const handleCancel = () => {
    navigate('/recipes');
  };

  return (
    <div className="er-root">
      <div className="er-header">
        <Link to="/recipes" className="er-back">← Recipes</Link>
        <h1 className="er-page-title">Edit recipe</h1>
        <p className="er-page-sub">"{recipe.name}"</p>
      </div>

      <div className="er-form-wrap">
        <RecipeForm
          mode="edit"
          recipe={recipe}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

      <style>{`
        .er-root { min-height: 100vh; padding-bottom: 64px; }
        .er-header {
          padding: 28px 48px 0;
          margin-bottom: 32px;
        }
        .er-back {
          display: inline-block;
          font-size: 0.8125rem;
          color: var(--brand-muted);
          margin-bottom: 12px;
          transition: color var(--transition-fast);
        }
        .er-back:hover { color: var(--brand); }
        .er-page-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .er-page-sub {
          font-size: 0.875rem;
          color: var(--brand-muted);
          font-style: italic;
        }
        .er-form-wrap {
          padding: 0 48px;
          max-width: 688px;
        }
        @media (max-width: 640px) {
          .er-header { padding: 20px 20px 0; }
          .er-form-wrap { padding: 0 20px; }
        }
      `}</style>
    </div>
  );
}*/
