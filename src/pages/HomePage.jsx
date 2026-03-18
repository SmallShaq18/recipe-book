import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeCard } from '../components/recipe/RecipeCard.jsx';
import { useConfirm } from '../hooks/useConfirm.js';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { toast } from 'react-toastify';

/* ─── Stat block ──────────────────────────────────────────────────────────── */
function StatBlock({ value, label }) {
  return (
    <div className="hp-stat text-center px-3">
      <div className="hp-stat-value h3 mb-0">{value}</div>
      <div className="hp-stat-label small text-uppercase fw-bold opacity-75">{label}</div>
    </div>
  );
}

/* ─── Collage image ───────────────────────────────────────────────────────── */
function CollageImage({ recipe }) {
  const catColors = {
    breakfast: '#6FAE48', lunch: '#E8A020', dinner: '#C0622A',
    dessert: '#7B5EA7', snack: '#3A8DC5',
  };
  const bg = catColors[recipe?.category] || 'var(--brand)';
  
  return (
    <div className="hp-collage-item shadow-sm border border-white">
      {recipe?.pic ? (
        <img src={recipe.pic} alt={recipe.name} className="img-fluid" />
      ) : (
        <div className="hp-collage-placeholder d-flex align-items-center justify-content-center h-100" style={{ background: bg }}>
          <span className="text-white fw-bold h4 m-0">{recipe?.name?.[0]?.toUpperCase() || '?'}</span>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { recipes, deleteRecipe } = useRecipes();
  const confirm = useConfirm();

  const totalRecipes = recipes.length;
  const mealsPlannedCount = useMemo(() => {
    try {
      const plan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
      return Object.values(plan).flat().filter(Boolean).length;
    } catch { return 0; }
  }, []);

  const collageRecipes = useMemo(() => [...recipes].sort((a, b) => b.id - a.id).slice(0, 4), [recipes]);
  const featuredRecipes = useMemo(() => [...recipes].sort((a, b) => b.id - a.id).slice(0, 6), [recipes]);

  const handleDelete = (recipeId) => {
    confirm.confirm('Delete this recipe? This cannot be undone.', () => {
      deleteRecipe(recipeId);
      toast.success('Recipe deleted!');
    });
  };

  return (
    <div className=" animate-fade-in">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="hp-hero-bg py-5 mb-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
              <span className="badge rounded-pill bg-light text-brand px-3 py-2 mb-3 shadow-sm border fw-bold text-uppercase">
                Personal Kitchen Companion
              </span>
              <h1 className="display-3 fw-bold mb-4">
                Cook with <br />
                <span className="text-brand italic-font">what you love.</span>
              </h1>
              <p className="lead opacity-75 mb-4 mx-auto mx-lg-0" style={{ maxWidth: '500px' }}>
                Save, organize, and rediscover your favorite recipes. 
                Build your shopping list and plan your meals in one place.
              </p>
              
              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-5">
                <Link to="/recipeList" className="btn btn-brand btn-lg rounded-pill px-4 shadow">Browse Recipes</Link>
                <Link to="/addNewRecipe" className="btn btn-outline-brand btn-lg rounded-pill px-4">Add a Recipe</Link>
              </div>

              {totalRecipes > 0 && (
                <div className="d-flex justify-content-center justify-content-lg-start align-items-center divide-x border-top pt-4">
                  <StatBlock value={totalRecipes} label="Saved" />
                  <div className="vr mx-2 opacity-25" style={{height: '40px'}}></div>
                  <StatBlock value={mealsPlannedCount || '0'} label="Planned" />
                </div>
              )}
            </div>

            <div className="col-lg-5">
              <div className="hp-collage-wrapper">
                <div className="hp-collage-grid">
                  {collageRecipes.length > 0 ? (
                     collageRecipes.map((r, i) => <CollageImage key={i} recipe={r} />)
                  ) : (
                    <div className="hp-collage-empty shadow-lg d-flex align-items-center justify-content-center">
                       <span className="opacity-25">🍳</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Section ─────────────────────────────────────── */}
      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-end mb-4 px-2">
          <div>
            <h2 className="fw-bold m-0">Recently Added</h2>
            <div className="bg-brand rounded" style={{ height: '4px', width: '40px' }}></div>
          </div>
          <Link to="/recipes" className="text-brand fw-bold text-decoration-none small">
            View All Recipes <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-4">
          {featuredRecipes.map((recipe, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={recipe.id}>
              <RecipeCard recipe={recipe} onDelete={handleDelete} index={index} />
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog {...confirm} />

      <style>{`
        :root {
          --brand: #C0622A;
          --brand-hover: #a14f20;
          --brand-light: #fdf5f0;
        }
        
        .text-brand { color: var(--brand) !important; }
        .btn-brand { background: var(--brand); color: white; border: none; }
        .btn-brand:hover { background: var(--brand-hover); color: white; }
        .btn-outline-brand { border: 2px solid var(--brand); color: var(--brand); }
        .btn-outline-brand:hover { background: var(--brand-light); color: var(--brand); border-color: var(--brand); }
        
        .hp-hero-bg {
          background: radial-gradient(circle at top right, var(--brand-light) 0%, transparent 70%);
        }

        .italic-font { font-style: italic; }

        .hp-collage-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          transform: rotate(-3deg);
        }

        .hp-collage-item {
          aspect-ratio: 1/1;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .hp-collage-item:hover {
          transform: scale(1.05) rotate(3deg);
          z-index: 2;
        }

        .hp-collage-item img {
          width: 100%; height: 100%; object-fit: cover;
        }

        .hp-collage-empty {
          height: 300px; width: 300px; background: white; border-radius: 30px; font-size: 5rem;
        }

        .hp-stat-value { font-family: var(--font-display); color: var(--brand); }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .hp-collage-grid { transform: rotate(0); max-width: 400px; margin: 0 auto; }
        }
      `}</style>
    </div>
  );
}

