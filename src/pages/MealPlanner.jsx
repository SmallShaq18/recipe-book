import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];

const CAT_COLORS = {
  breakfast: '#6FAE48', lunch: '#E8A020', dinner: '#C0622A',
  dessert: '#7B5EA7', snack: '#3A8DC5', snacks: '#3A8DC5',
};

/* ─── Mini recipe card for planner slots ─────────────────────────────────── */
function SlotCard({ recipe, onRemove }) {
  const dot = CAT_COLORS[recipe.category?.toLowerCase()] || '#C0622A';
  return (
    <div className="mp-slot-card">
      <div className="mp-slot-img-wrap">
        <img
          src={recipe.pic || '/images/recipe1.jpg'}
          alt={recipe.name}
          className="mp-slot-img"
        />
      </div>
      <div className="mp-slot-body">
        <div className="mp-slot-name">{recipe.name}</div>
        {/*<div className="mp-slot-meta">
          <span className="mp-slot-dot" style={{ background: dot }} />
          <span className="mp-slot-cat">{recipe.category}</span>
          {recipe.cook && <span className="mp-slot-time">· {recipe.cook}</span>}
        </div>*/}
      </div>
      <button className="mp-slot-remove" onClick={onRemove} title="Remove">×</button>
    </div>
  );
}

/* ─── Empty slot ─────────────────────────────────────────────────────────── */
function EmptySlot({ meal, onClick }) {
  return (
    <button className="mp-empty-slot" onClick={onClick}>
      <span className="mp-empty-plus">+</span>
      <span className="mp-empty-label">Add {meal}</span>
    </button>
  );
}

/* ─── Recipe selector modal ──────────────────────────────────────────────── */
function RecipeSelector({ recipes, day, meal, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mp-modal-backdrop" onClick={onClose}>
      <div className="mp-modal" onClick={e => e.stopPropagation()}>
        <div className="mp-modal-header">
          <div>
            <div className="mp-modal-eyebrow">
              {day} · <span style={{ textTransform: 'capitalize' }}>{meal}</span>
            </div>
            <h2 className="mp-modal-title">Choose a recipe</h2>
          </div>
          <button className="mp-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="mp-modal-search-wrap">
          <span className="mp-modal-search-icon">⌕</span>
          <input
            type="text"
            className="mp-modal-search"
            placeholder="Search recipes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mp-modal-grid">
          {filtered.length === 0 ? (
            <div className="mp-modal-empty">
              {recipes.length === 0
                ? <>No recipes yet. <Link to="/addRecipe" onClick={onClose}>Add one →</Link></>
                : 'No recipes match that search.'
              }
            </div>
          ) : (
            filtered.map(recipe => (
              <button
                key={recipe.id}
                className="mp-recipe-option"
                onClick={() => onSelect(recipe.id)}
              >
                <div className="mp-option-img-wrap">
                  <img
                    src={recipe.pic || '/images/recipe1.jpg'}
                    alt={recipe.name}
                    className="mp-option-img"
                  />
                </div>
                <div className="mp-option-body">
                  <div className="mp-option-name">{recipe.name}</div>
                  <div className="mp-option-meta">
                    <span
                      className="mp-slot-dot"
                      style={{ background: CAT_COLORS[recipe.category?.toLowerCase()] || '#C0622A' }}
                    />
                    <span style={{ textTransform: 'capitalize', fontSize: '0.75rem', color: 'var(--brand-muted)' }}>
                      {recipe.category}
                    </span>
                    {recipe.cook && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--brand-muted)' }}> · {recipe.cook}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MealPlanner ─────────────────────────────────────────────────────────── */
export default function MealPlanner() {
  const { recipes } = useRecipes();
  const [mealPlan, setMealPlan] = useState({});
  const [selecting, setSelecting] = useState(null); // { day, meal }

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mealPlan');
      if (saved) setMealPlan(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const key = (day, meal) => `${day}-${meal}`;

  const getRecipe = (day, meal) => {
    const entry = mealPlan[key(day, meal)];
    if (!entry) return null;
    return recipes.find(r => r.id === entry.recipeId) || null;
  };

  const handleSelect = (recipeId) => {
    if (!selecting) return;
    const { day, meal } = selecting;
    setMealPlan(prev => ({
      ...prev,
      [key(day, meal)]: { recipeId, meal },
    }));
    setSelecting(null);
  };

  const handleRemove = (day, meal) => {
    setMealPlan(prev => {
      const next = { ...prev };
      delete next[key(day, meal)];
      return next;
    });
  };

  const clearWeek = () => {
    if (window.confirm('Clear the entire week?')) setMealPlan({});
  };

  // Stats
  const filledSlots = Object.keys(mealPlan).length;
  const totalSlots  = DAYS.length * MEALS.length;

  return (
    <div className="mp-root">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="mp-page-header">
        <div>
          <h1 className="mp-page-title">Meal Planner</h1>
          <p className="mp-page-sub">
            {filledSlots === 0
              ? 'Click any slot to plan your week'
              : `${filledSlots} of ${totalSlots} slots filled`
            }
          </p>
        </div>
        <div className="mp-header-actions">
          {filledSlots > 0 && (
            <button className="mp-clear-btn" onClick={clearWeek}>
              Clear week
            </button>
          )}
          {/*<Link to="/addNewRecipe" className="mp-add-btn">+ Add recipe</Link>*/}
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      {filledSlots > 0 && (
        <div className="mp-progress-wrap">
          <div className="mp-progress-track">
            <div
              className="mp-progress-fill"
              style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
            />
          </div>
          <span className="mp-progress-label">{Math.round((filledSlots / totalSlots) * 100)}% planned</span>
        </div>
      )}

      {/* ── 7-day grid ────────────────────────────────────────────────── */}
      <div className="mp-grid">
        {DAYS.map(day => (
          <div key={day} className="mp-day-col">
            <div className="mp-day-header fw-bold">{day}</div>
            <div className="mp-day-meals">
              {MEALS.map(meal => {
                const recipe = getRecipe(day, meal);
                return (
                  <div key={meal} className="mp-meal-row">
                    <div className="mp-meal-label">{meal}</div>
                    {recipe
                      ? <SlotCard recipe={recipe} onRemove={() => handleRemove(day, meal)} />
                      : <EmptySlot meal={meal} onClick={() => setSelecting({ day, meal })} />
                    }
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Recipe selector modal ─────────────────────────────────────── */}
      {selecting && (
        <RecipeSelector
          recipes={recipes}
          day={selecting.day}
          meal={selecting.meal}
          onSelect={handleSelect}
          onClose={() => setSelecting(null)}
        />
      )}

      <style>{`
        /* ── Root ────────────────────────────────────────────────────────── */
        .mp-root {
          min-height: 100vh;
          padding-bottom: 64px;
        }

        /* ── Page header ─────────────────────────────────────────────────── */
        .mp-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 32px 40px 0;
          margin-bottom: 16px;
        }
        .mp-page-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .mp-page-sub {
          font-size: 0.875rem;
          color: var(--brand-muted);
        }
        .mp-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 6px;
        }
        .mp-clear-btn {
          padding: 8px 16px;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-pill);
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--brand-muted);
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }
        .mp-clear-btn:hover { border-color: var(--brand); color: var(--brand); }
        .mp-add-btn {
          padding: 8px 18px;
          background: var(--brand);
          color: #fff;
          border-radius: var(--radius-pill);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background var(--transition-fast);
        }
        .mp-add-btn:hover { background: var(--brand-hover); }

        /* ── Progress ────────────────────────────────────────────────────── */
        .mp-progress-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 40px 20px;
        }
        .mp-progress-track {
          flex: 1;
          height: 3px;
          background: rgba(150, 80, 30, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .mp-progress-fill {
          height: 100%;
          background: var(--brand);
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .mp-progress-label {
          font-size: 0.75rem;
          color: var(--brand-muted);
          white-space: nowrap;
        }

        /* ── 7-day grid ──────────────────────────────────────────────────── */
        .mp-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0;
          padding: 0 20px;
          overflow-x: auto;
        }
        .mp-day-col {
          border-right: 0.5px solid rgba(150, 80, 30, 0.08);
          min-width: 140px;
        }
        .mp-day-col:last-child { border-right: none; }

        .mp-day-header {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand-muted);
          padding: 10px 8px 12px;
          text-align: center;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.08);
        }
        /* Highlight today */
        .mp-day-col.today .mp-day-header {
          color: var(--brand);
          border-bottom-color: var(--brand);
        }

        .mp-day-meals { padding: 12px 10px; }
        .mp-meal-row { margin-bottom: 8px; }
        .mp-meal-label {
          font-size: 0.5625rem;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--brand-muted);
          margin-bottom: 4px;
          padding: 0 2px;
        }

        /* ── Slot card (filled) ───────────────────────────────────────────── */
        .mp-slot-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--surface-card);
          border: 0.5px solid rgba(150, 80, 30, 0.1);
          border-radius: var(--radius-sm);
          padding: 6px 8px 6px 6px;
          position: relative;
          transition: box-shadow var(--transition-fast);
        }
        .mp-slot-card:hover {
          box-shadow: var(--shadow-card);
        }
        .mp-slot-img-wrap {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .mp-slot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .mp-slot-body { flex: 1; min-width: 0; }
        .mp-slot-name {
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
          margin-bottom: 3px;
          color: #fff;
        }
        .mp-slot-meta {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .mp-slot-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .mp-slot-cat, .mp-slot-time {
          font-size: 0.625rem;
          color: var(--brand-muted);
          text-transform: capitalize;
          white-space: nowrap;
        }
        .mp-slot-remove {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: rgba(150, 80, 30, 0.12);
          color: var(--brand-muted);
          font-size: 0.75rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-fast), background var(--transition-fast);
        }
        .mp-slot-card:hover .mp-slot-remove { opacity: 1; }
        .mp-slot-remove:hover { background: rgba(192, 98, 42, 0.2); color: var(--brand); }

        /* ── Empty slot ──────────────────────────────────────────────────── */
        .mp-empty-slot {
          width: 100%;
          min-height: 60px;
          border: 1px dashed rgba(150, 80, 30, 0.15);
          border-radius: var(--radius-sm);
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          transition: border-color var(--transition-fast), background var(--transition-fast);
          cursor: pointer;
          padding: 8px 4px;
        }
        .mp-empty-slot:hover {
          border-color: var(--brand);
          background: var(--brand-light);
        }
        .mp-empty-plus {
          font-size: 1rem;
          color: var(--brand);
          opacity: 0.4;
          line-height: 1;
        }
        .mp-empty-slot:hover .mp-empty-plus { opacity: 0.8; }
        .mp-empty-label {
          font-size: 0.625rem;
          color: var(--brand-muted);
          text-transform: capitalize;
        }

        /* ── Modal backdrop ──────────────────────────────────────────────── */
        .mp-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26, 10, 0, 0.45);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .mp-modal {
          background: var(--surface-warm);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-pop);
          width: 100%;
          max-width: 560px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mp-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 24px 16px;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .mp-modal-eyebrow {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 4px;
        }
        .mp-modal-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 500;
          color: #fff
        }
        .mp-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          background: transparent;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-muted);
          flex-shrink: 0;
          transition: background var(--transition-fast);
        }
        .mp-modal-close:hover { background: var(--brand-light); color: var(--brand); }

        /* Modal search */
        .mp-modal-search-wrap {
          position: relative;
          padding: 14px 24px;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.08);
          color: #fff;
        }
        .mp-modal-search-icon {
          position: absolute;
          left: 36px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          opacity: 0.35;
          pointer-events: none;
        }
        .mp-modal-search {
          width: 100%;
          padding: 9px 12px 9px 34px;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          border-radius: var(--radius-sm);
          background: var(--surface-card);
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: inherit;
        }
        .mp-modal-search:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-light);
        }

        /* Modal grid */
        .mp-modal-grid {
          overflow-y: auto;
          padding: 16px 24px 24px;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }
        .mp-modal-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 32px 0;
          font-size: 0.875rem;
          color: var(--brand-muted);
        }
        .mp-modal-empty a { color: var(--brand); text-decoration: underline; }

        /* Recipe option card inside modal */
        .mp-recipe-option {
          background: var(--surface-card);
          border: 0.5px solid rgba(150, 80, 30, 0.1);
          border-radius: var(--radius-card);
          overflow: hidden;
          text-align: left;
          cursor: pointer;
          transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
          width: 100%;
          color: #fff;
        }
        .mp-recipe-option:hover {
          border-color: var(--brand);
          box-shadow: var(--shadow-card);
        }
        .mp-option-img-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .mp-option-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-base);
        }
        .mp-recipe-option:hover .mp-option-img { transform: scale(1.04); }
        .mp-option-body { padding: 8px 10px 10px; }
        .mp-option-name {
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1.3;
          margin-bottom: 5px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .mp-option-meta {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Responsive ──────────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .mp-grid { grid-template-columns: repeat(4, minmax(140px, 1fr)); }
        }
        @media (max-width: 600px) {
          .mp-page-header { padding: 20px 16px 0; flex-wrap: wrap; gap: 12px; }
          .mp-progress-wrap { padding: 0 16px 16px; }
          .mp-grid { grid-template-columns: repeat(2, minmax(150px, 1fr)); padding: 0 16px; }
          .mp-modal { max-height: 90vh; }
        }
      `}</style>
    </div>
  );
}

