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
          <div className="row align-items-center g-5">
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

/*import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { RecipeCard } from '../components/recipe/RecipeCard.jsx';
import { useConfirm } from '../hooks/useConfirm.js';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { toast } from 'react-toastify';

/* ─── Stat block ──────────────────────────────────────────────────────────── *
function StatBlock({ value, label }) {
  return (
    <div className="hp-stat">
      <span className="hp-stat-value">{value}</span>
      <span className="hp-stat-label">{label}</span>
    </div>
  );
}

/* ─── Collage image ───────────────────────────────────────────────────────── *
function CollageImage({ recipe }) {
  const catColors = {
    breakfast: '#6FAE48', lunch: '#E8A020', dinner: '#C0622A',
    dessert: '#7B5EA7', snack: '#3A8DC5', snacks: '#3A8DC5',
  };
  const bg = catColors[recipe?.category] || '#C0622A';
  if (recipe?.pic) {
    return (
      <div className="hp-collage-item">
        <img src={recipe.pic} alt={recipe.name} />
      </div>
    );
  }
  return (
    <div className="hp-collage-item" style={{ background: bg }}>
      <span className="hp-collage-initial">
        {recipe?.name?.[0]?.toUpperCase() || '?'}
      </span>
    </div>
  );
}

/* ─── HomePage ────────────────────────────────────────────────────────────── *
export default function HomePage({ darkMode }) {
  const { recipes, deleteRecipe } = useRecipes();
  const confirm = useConfirm();

  // Stats
  const totalRecipes = recipes.length;

  const mealsPlannedCount = useMemo(() => {
    try {
      const plan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
      return Object.values(plan).flat().filter(Boolean).length;
    } catch {
      return 0;
    }
  }, []);

  const topCategory = useMemo(() => {
    if (!recipes.length) return '—';
    const counts = {};
    recipes.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  }, [recipes]);

  // Collage: 4 newest
  const collageRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => b.id - a.id).slice(0, 4);
  }, [recipes]);

  // Featured: 6 newest
  const featuredRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => b.id - a.id).slice(0, 6);
  }, [recipes]);

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
    <div className="hp-root">

      {/* ── Hero ──────────────────────────────────────────────────────── *
      <section className="hp-hero">
        <div className="hp-hero-left">
          <p className="hp-eyebrow">Your personal kitchen companion</p>
          <h1 className="hp-title">
            Cook with<br />what you <em>love.</em>
          </h1>
          <p className="hp-subtitle">
            Save, organise, and rediscover your favourite recipes.
            Plan your week and build your shopping list in one place.
          </p>
          <div className="hp-cta-row">
            <Link to="/recipes" className="hp-btn-primary">Browse Recipes</Link>
            <Link to="/addRecipe" className="hp-btn-secondary">Add a Recipe</Link>
          </div>

          {totalRecipes > 0 && (
            <div className="hp-stats-row">
              <StatBlock value={totalRecipes} label="Recipes saved" />
              <div className="hp-stat-divider" />
              <StatBlock value={mealsPlannedCount || '—'} label="Meals planned" />
              <div className="hp-stat-divider" />
              <StatBlock value={topCategory} label="Top category" />
            </div>
          )}
        </div>

        {/* Collage *
        {collageRecipes.length > 0 && (
          <div className="hp-hero-right">
            <div className="hp-collage">
              {[0, 1, 2, 3].map(i => (
                <CollageImage key={i} recipe={collageRecipes[i]} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Featured strip ─────────────────────────────────────────── *
      <section className="hp-featured">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Recently added</h2>
          {recipes.length > 6 && (
            <Link to="/recipes" className="hp-see-all">See all →</Link>
          )}
        </div>

        {featuredRecipes.length > 0 ? (
          <div className="hp-card-grid">
            {featuredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="hp-empty">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <ellipse cx="32" cy="42" rx="22" ry="12" fill="var(--surface-warm-deep)" />
              <ellipse cx="32" cy="38" rx="18" ry="10" fill="#E8C4A0" />
              <ellipse cx="32" cy="36" rx="14" ry="8" fill="#D4A070" />
              <path d="M20 22 Q32 14 44 22" stroke="#C0622A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <h3 className="hp-empty-title">Nothing here yet</h3>
            <p className="hp-empty-sub">Add your first recipe to get started</p>
            <Link to="/addRecipe" className="hp-btn-primary" style={{ display: 'inline-block' }}>
              Add a Recipe
            </Link>
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancel}
        onClose={confirm.close}
      />

      <style>{`
        /* ── Root ────────────────────────────────────────────────────────── 
        .hp-root {
          min-height: 100vh;
        }

        /* ── Hero ────────────────────────────────────────────────────────── 
        .hp-hero {
          display: flex;
          align-items: center;
          gap: 48px;
          padding: 56px 48px 48px;
          
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .hp-hero-left { flex: 1; max-width: 520px; }
        .hp-eyebrow {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 14px;
        }
        .hp-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .hp-title em {
          font-style: italic;
          color: var(--brand);
        }
        .hp-subtitle {
          font-size: 0.9375rem;
          color: var(--brand-muted);
          line-height: 1.65;
          max-width: 400px;
          margin-bottom: 28px;
        }

        /* ── CTA buttons ─────────────────────────────────────────────────── 
        .hp-cta-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .hp-btn-primary {
          background: var(--brand);
          color: #fff;
          padding: 10px 24px;
          border-radius: var(--radius-pill);
          font-size: 0.875rem;
          font-weight: 500;
          border: none;
          transition: background var(--transition-fast), box-shadow var(--transition-fast);
          text-decoration: none;
        }
        .hp-btn-primary:hover {
          background: var(--brand-hover);
          box-shadow: 0 4px 16px rgba(192, 98, 42, 0.28);
          color: #fff;
        }
        .hp-btn-secondary {
          background: transparent;
          color: var(--brand);
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid var(--brand);
          transition: background var(--transition-fast);
          text-decoration: none;
        }
        .hp-btn-secondary:hover {
          background: var(--brand-light);
        }

        /* ── Stats ───────────────────────────────────────────────────────── 
        .hp-stats-row {
          display: flex;
          align-items: center;
          gap: 20px;
          padding-top: 24px;
          border-top: 0.5px solid rgba(150, 80, 30, 0.12);
        }
        .hp-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(150, 80, 30, 0.15);
        }
        .hp-stat {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .hp-stat-value {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 500;
          line-height: 1;
          text-transform: capitalize;
        }
        .hp-stat-label {
          font-size: 0.6875rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--brand-muted);
        }

        /* ── Collage ─────────────────────────────────────────────────────── 
        .hp-hero-right { flex-shrink: 0; }
        .hp-collage {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 220px;
        }
        .hp-collage-item {
          width: 106px;
          height: 106px;
          border-radius: var(--radius-card);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hp-collage-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hp-collage-initial {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
        }

        /* ── Featured section ────────────────────────────────────────────── 
        .hp-featured {
          padding: 40px 48px 56px;
        }
        .hp-section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .hp-section-title {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .hp-see-all {
          font-size: 0.8125rem;
          color: var(--brand);
          font-weight: 500;
        }
        .hp-see-all:hover { text-decoration: underline; }

        /* ── Card grid ───────────────────────────────────────────────────── 
        .hp-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        /* ── Empty state ─────────────────────────────────────────────────── 
        .hp-empty {
          text-align: center;
          padding: 64px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .hp-empty svg { opacity: 0.5; margin-bottom: 8px; }
        .hp-empty-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 500;
        }
        .hp-empty-sub {
          font-size: 0.875rem;
          color: var(--brand-muted);
          margin-bottom: 8px;
        }

        /* ── Responsive ──────────────────────────────────────────────────── 
        @media (max-width: 768px) {
          .hp-hero {
            flex-direction: column;
            padding: 36px 24px 32px;
            gap: 32px;
          }
          .hp-hero-right { order: -1; }
          .hp-collage { width: 100%; grid-template-columns: repeat(4, 1fr); }
          .hp-collage-item { width: 100%; height: 80px; }
          .hp-featured { padding: 32px 24px 40px; }
        }
        @media (max-width: 480px) {
          .hp-collage { grid-template-columns: repeat(2, 1fr); }
          .hp-collage-item { height: 100px; }
        }
      `}</style>
    </div>
  );
}*/
