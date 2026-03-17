import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce.js';

const TIME_REGEX = /\d+\s*(min|hour|hr|minute)/i;

function getTime(step) {
  const m = step?.match(TIME_REGEX);
  return m ? m[0] : null;
}

function CategoryDot({ category }) {
  const colors = {
    breakfast: '#6FAE48', lunch: '#E8A020', dinner: '#C0622A',
    dessert: '#7B5EA7', snack: '#3A8DC5', snacks: '#3A8DC5',
  };
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8, height: 8,
        borderRadius: '50%',
        background: colors[category?.toLowerCase()] || '#C0622A',
        marginRight: 6,
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
    />
  );
}

export default function RecipeDetails() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const recipe = recipes.find(r => r.id === recipeId);

  const [cookMode, setCookMode]                   = useState(false);
  const [activeTab, setActiveTab]                 = useState('ingredients');
  const [adjustedServings, setAdjustedServings]   = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const [currentStep, setCurrentStep]             = useState(0);
  const [drawerOpen, setDrawerOpen]               = useState(false);
  const [notes, setNotes]                         = useState('');
  const [notesSaved, setNotesSaved]               = useState(false);
  const wakeLockRef = useRef(null);

  // Init once recipe is available
  useEffect(() => {
    if (recipe && adjustedServings === null) {
      setAdjustedServings(Number(recipe.servings) || 1);
    }
    if (recipe && !notes) {
      const saved = localStorage.getItem(`recipe-notes-${recipeId}`);
      setNotes(saved ?? recipe.notes ?? '');
    }
  }, [recipe]);

  // Notes auto-save
  const debouncedNotes = useDebounce(notes, 500);
  useEffect(() => {
    if (recipe && debouncedNotes !== undefined) {
      localStorage.setItem(`recipe-notes-${recipeId}`, debouncedNotes);
      setNotesSaved(true);
      const t = setTimeout(() => setNotesSaved(false), 1500);
      return () => clearTimeout(t);
    }
  }, [debouncedNotes, recipeId]);

  // Wake lock
  useEffect(() => {
    if (cookMode) {
      (async () => {
        try { wakeLockRef.current = await navigator.wakeLock.request('screen'); } catch {}
      })();
    } else {
      try { wakeLockRef.current?.release(); wakeLockRef.current = null; } catch {}
    }
    return () => {
      try { wakeLockRef.current?.release(); wakeLockRef.current = null; } catch {}
    };
  }, [cookMode]);

  // Keyboard nav in cook mode
  useEffect(() => {
    if (!cookMode) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft')  prevStep();
      if (e.key === 'Escape')     setCookMode(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cookMode, currentStep, recipe]);

  const servings = adjustedServings ?? Number(recipe?.servings) ?? 1;

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    const base = Number(recipe.servings) || 1;
    const scale = servings / base;
    return recipe.ingredients.map(ing => {
      const match = ing.match(/^([\d./]+)\s*(.+)$/);
      if (match) {
        const amt = parseFloat(match[1]);
        const scaled = (amt * scale);
        const display = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace(/\.0$/, '');
        return `${display} ${match[2]}`;
      }
      return ing;
    });
  }, [recipe, servings]);

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Recipe not found</h2>
        <button className="rd-btn-outline" onClick={() => navigate('/recipes')}>
          ← Back to recipes
        </button>
      </div>
    );
  }

  const toggleIngredient = (i) => {
    const s = new Set(checkedIngredients);
    s.has(i) ? s.delete(i) : s.add(i);
    setCheckedIngredients(s);
  };

  const nextStep = () => {
    if (currentStep < recipe.instructions.length - 1) setCurrentStep(s => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const TABS = ['Ingredients', 'Instructions', 'Cook mode', 'Notes'];

  return (
    <div className="rd-root">

      {/* ── Hero band ─────────────────────────────────────────────────── */}
      <div className="rd-hero">
        <img
          src={recipe.pic || '/images/recipe1.jpg'}
          alt={recipe.name}
          className="rd-hero-img"
        />
        <div className="rd-hero-meta">
          <div className="rd-eyebrow">
            <CategoryDot category={recipe.category} />
            {recipe.category?.toUpperCase()}
            {recipe.cuisine ? ` · ${recipe.cuisine}` : ''}
          </div>
          <h1 className="rd-title">{recipe.name}</h1>
          <div className="rd-meta-row">
            {[
              { v: recipe.prep,       l: 'Prep' },
              { v: recipe.cook,       l: 'Cook' },
              { v: recipe.servings,   l: 'Serves' },
              { v: recipe.difficulty, l: 'Difficulty' },
            ].map(({ v, l }) => v ? (
              <div key={l} className="rd-meta-block">
                <span className="rd-meta-val">{v}</span>
                <span className="rd-meta-lbl">{l}</span>
              </div>
            ) : null)}
          </div>
          <div className="rd-action-row">
            <button className="rd-btn-primary" onClick={() => { setCookMode(true); setCurrentStep(0); }}>
              Start cooking
            </button>
            <Link to={`/editRecipe/${recipe.id}`} className="rd-btn-outline">Edit</Link>
            <Link to={`/shopping-list?ids=${recipe.id}`} className="rd-btn-outline">Shopping list</Link>
            {/*<button className="rd-btn-outline">+ Shopping list</button>*/}
          </div>
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      {!cookMode && (
        <div className="rd-tab-bar">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`rd-tab ${activeTab === tab.toLowerCase().replace(' ', ' ') ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.toLowerCase());
                if (tab === 'Cook mode') { setCookMode(true); setCurrentStep(0); }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* ── Tab content ───────────────────────────────────────────────── */}
      {!cookMode && (
        <div className="rd-content">

          {/* INGREDIENTS */}
          {activeTab === 'ingredients' && (
            <div className="rd-two-col">
              <div className="rd-ing-col">
                <div className="rd-servings-adjuster">
                  <button onClick={() => setAdjustedServings(Math.max(1, servings - 1))}>−</button>
                  <span>{servings} serving{servings !== 1 ? 's' : ''}</span>
                  <button onClick={() => setAdjustedServings(servings + 1)}>+</button>
                </div>
                <div className="rd-ing-list">
                  {scaledIngredients.map((ing, i) => (
                    <div
                      key={i}
                      className={`rd-ing-row ${checkedIngredients.has(i) ? 'done' : ''}`}
                      onClick={() => toggleIngredient(i)}
                    >
                      <span className="rd-ing-check">
                        {checkedIngredients.has(i) ? '✓' : ''}
                      </span>
                      <span className="rd-ing-name">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rd-inst-col">
                <p className="rd-col-label">Instructions preview</p>
                {recipe.instructions.slice(0, 3).map((step, i) => (
                  <div
                    key={i}
                    className={`rd-step-card ${i === currentStep ? 'active' : ''}`}
                    onClick={() => { setCurrentStep(i); setActiveTab('instructions'); }}
                  >
                    <div className="rd-step-num">Step {i + 1}</div>
                    <div className="rd-step-text">{step}</div>
                    {getTime(step) && <div className="rd-timer-pill">⏱ {getTime(step)}</div>}
                  </div>
                ))}
                {recipe.instructions.length > 3 && (
                  <button
                    className="rd-see-all-steps"
                    onClick={() => setActiveTab('instructions')}
                  >
                    See all {recipe.instructions.length} steps →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="rd-inst-full">
              {recipe.instructions.map((step, i) => (
                <div
                  key={i}
                  className={`rd-step-card ${i === currentStep ? 'active' : ''}`}
                  onClick={() => setCurrentStep(i)}
                >
                  <div className="rd-step-num">Step {i + 1}</div>
                  <div className="rd-step-text">{step}</div>
                  {getTime(step) && <div className="rd-timer-pill">⏱ {getTime(step)}</div>}
                </div>
              ))}
            </div>
          )}

          {/* NOTES */}
          {activeTab === 'notes' && (
            <div className="rd-notes-area">
              <div className="rd-notes-header">
                <span className="rd-col-label">Personal notes</span>
                <span className={`rd-autosave ${notesSaved ? 'visible' : ''}`}>auto-saved ✓</span>
              </div>
              <textarea
                className="rd-notes-textarea"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add your personal notes, tweaks, and tips here…"
                rows={8}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Cook mode ─────────────────────────────────────────────────── */}
      {cookMode && (
        <div className="rd-cook-mode">
          <button className="rd-exit-btn" onClick={() => setCookMode(false)}>✕</button>

          {/* Ingredient drawer */}
          {/*<div className={`rd-drawer ${drawerOpen ? 'open' : ''}`}>
            <button className="rd-drawer-tab" onClick={() => setDrawerOpen(v => !v)}>
              {drawerOpen ? '←' : '≡'}
            </button>
            <div className="rd-drawer-content">
              <p className="rd-col-label" style={{ padding: '0 16px', marginBottom: 12 }}>Ingredients</p>
              {scaledIngredients.map((ing, i) => (
                <div
                  key={i}
                  className={`rd-drawer-item ${checkedIngredients.has(i) ? 'done' : ''}`}
                  onClick={() => toggleIngredient(i)}
                >
                  <span className="rd-ing-check">{checkedIngredients.has(i) ? '✓' : ''}</span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>*/}

          {/* Main step area */}
          <div className="rd-cook-main">
            <div className="rd-cook-step-label">
              Step {currentStep + 1} of {recipe.instructions.length}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="rd-cook-step-text"
              >
                {recipe.instructions[currentStep]}
              </motion.div>
            </AnimatePresence>

            {getTime(recipe.instructions[currentStep]) && (
              <div className="rd-timer-pill rd-timer-lg">
                ⏱ {getTime(recipe.instructions[currentStep])}
              </div>
            )}

            <div className="rd-keyboard-hint">Use ← → arrow keys to navigate</div>
            <div className="rd-keyboard-hint">Use ESC key to exit cook mode</div>
          </div>

          {/* Bottom bar */}
          <div className="rd-cook-bar">
            <button
              className="rd-cook-nav-btn"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Prev
            </button>
            <div className="rd-cook-progress">
              <div className="rd-progress-track">
                <div
                  className="rd-progress-fill"
                  style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                />
              </div>
              <span className="rd-progress-label">
                {Math.round(((currentStep + 1) / recipe.instructions.length) * 100)}% complete
              </span>
            </div>
            <button
              className="rd-cook-nav-btn primary"
              onClick={nextStep}
              disabled={currentStep === recipe.instructions.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      <style>{`
        /* ── Root ────────────────────────────────────────────────────────── */
        .rd-root { min-height: 100vh; }

        /* ── Hero ────────────────────────────────────────────────────────── */
        .rd-hero {
          display: flex;
          gap: 28px;
          align-items: flex-start;
          padding: 32px 48px;
          
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .rd-hero-img {
          width: 160px;
          height: 140px;
          object-fit: cover;
          border-radius: var(--radius-card);
          flex-shrink: 0;
        }
        .rd-hero-meta { flex: 1; }
        .rd-eyebrow {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.09em;
          color: var(--brand);
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .rd-title {
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 1.875rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 14px;
        }
        .rd-meta-row {
          display: flex;
          gap: 0;
          margin-bottom: 20px;
        }
        .rd-meta-block {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-right: 20px;
          margin-right: 20px;
          border-right: 0.5px solid rgba(150, 80, 30, 0.15);
        }
        .rd-meta-block:last-child { border-right: none; }
        .rd-meta-val {
          font-size: 0.9375rem;
          font-weight: 500;
          line-height: 1;
        }
        .rd-meta-lbl {
          font-size: 0.625rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand-muted);
        }
        .rd-action-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .rd-btn-primary {
          background: var(--brand);
          color: #fff;
          padding: 9px 20px;
          border-radius: var(--radius-pill);
          border: none;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          transition: background var(--transition-fast), box-shadow var(--transition-fast);
        }
        .rd-btn-primary:hover {
          background: var(--brand-hover);
          box-shadow: 0 3px 12px rgba(192,98,42,0.28);
        }
        .rd-btn-outline {
          background: transparent;
          color: inherit;
          padding: 9px 16px;
          border-radius: var(--radius-pill);
          border: 0.5px solid rgba(150, 80, 30, 0.25);
          font-family: var(--font-body);
          font-size: 0.875rem;
          transition: background var(--transition-fast), border-color var(--transition-fast);
          text-decoration: none;
        }
        .rd-btn-outline:hover {
          background: var(--brand-light);
          border-color: var(--brand);
          color: var(--brand);
        }

        /* ── Tab bar ─────────────────────────────────────────────────────── */
        .rd-tab-bar {
          display: flex;
          gap: 0;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.1);
          padding: 0 48px;
          position: relative;
          
          z-index: 10;
        }
        .rd-tab {
          padding: 14px 18px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 400;
          color: inherit;
          opacity: 0.55;
          transition: opacity var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          cursor: pointer;
        }
        .rd-tab:hover { opacity: 0.85; }
        .rd-tab.active {
          opacity: 1;
          border-bottom-color: var(--brand);
          color: var(--brand);
          font-weight: 500;
        }

        /* ── Content area ────────────────────────────────────────────────── */
        .rd-content { padding: 28px 48px 48px; }
        .rd-two-col {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 32px;
        }
        .rd-col-label {
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--brand-muted);
          margin-bottom: 14px;
        }

        /* ── Servings adjuster ───────────────────────────────────────────── */
        .rd-servings-adjuster {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .rd-servings-adjuster button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.25);
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .rd-servings-adjuster button:hover {
          background: var(--brand-light);
          border-color: var(--brand);
          color: var(--brand);
        }
        .rd-servings-adjuster span {
          font-size: 0.875rem;
          font-weight: 500;
          min-width: 80px;
          text-align: center;
        }

        /* ── Ingredient list ─────────────────────────────────────────────── */
        .rd-ing-list { display: flex; flex-direction: column; }
        .rd-ing-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.08);
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }
        .rd-ing-row:last-child { border-bottom: none; }
        .rd-ing-row.done { opacity: 0.45; }
        .rd-ing-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(150, 80, 30);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          color: #fff;
          background: transparent;
          transition: background var(--transition-fast);
        }
        .rd-ing-row.done .rd-ing-check {
          background: var(--brand);
          border-color: var(--brand);
        }
        .rd-ing-name {
          font-size: 0.875rem;
          line-height: 1.4;
          flex: 1;
        }
        .rd-ing-row.done .rd-ing-name {
          text-decoration: line-through;
        }

        /* ── Step cards ──────────────────────────────────────────────────── */
        .rd-step-card {
          border: 0.5px solid rgba(150, 80, 30, 0.12);
          border-radius: var(--radius-card);
          padding: 14px 16px;
          margin-bottom: 10px;
        
          cursor: pointer;
          transition: border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
        }
        .rd-step-card:hover { border-color: rgba(150, 80, 30, 0.25); }
        .rd-step-card.active {
          border-left: 3px solid var(--brand);
        }
        .rd-step-num {
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 6px;
        }
        .rd-step-text {
          font-size: 0.875rem;
          line-height: 1.6;
          color: inherit;
        }
        .rd-timer-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          background: var(--surface-warm-deep);
          color: var(--brand);
          font-size: 0.75rem;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
        }
        .rd-see-all-steps {
          background: transparent;
          border: none;
          color: var(--brand);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 8px 0;
          text-decoration: underline;
        }
        .rd-inst-full { max-width: 680px; }

        /* ── Notes ───────────────────────────────────────────────────────── */
        .rd-notes-area { max-width: 600px; }
        .rd-notes-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .rd-autosave {
          font-size: 0.75rem;
          color: var(--brand);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        .rd-autosave.visible { opacity: 1; }
        .rd-notes-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-card);
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.7;
          color: inherit;
          resize: vertical;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .rd-notes-textarea:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-light);
        }

        /* ── Cook mode ───────────────────────────────────────────────────── */
        .rd-cook-mode {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          flex-direction: column;
          width: 100%;
          background: rgba(0, 0, 0, 0.88);
        }
        .rd-exit-btn {
          position: fixed;
          top: 70px;
          right: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          background: #fff;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 220;
          transition: background var(--transition-fast);
        }
        .rd-exit-btn:hover { background: var(--brand-light); }

        /* Ingredient drawer */
        .rd-drawer {
          position: fixed;
          top: 64px;
          left: 0;
          bottom: 72px;
          width: 48px;
          background: var(--surface-warm-deep);
          border-right: 0.5px solid rgba(150, 80, 30, 0.1);
          transition: width var(--transition-base);
          overflow: hidden;
          z-index: 5;
        }
        .rd-drawer.open { width: 240px; }
        .rd-drawer-tab {
          position: absolute;
          top: 16px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .rd-drawer-content {
          padding: 56px 0 16px;
          overflow-y: auto;
          height: 100%;
          white-space: nowrap;
        }
        .rd-drawer-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.8125rem;
          cursor: pointer;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.06);
        }
        .rd-drawer-item.done { opacity: 0.45; }
        .rd-drawer-item.done .rd-ing-check {
          background: var(--brand);
          border-color: var(--brand);
        }

        /* Main cook area */
        .rd-cook-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 80px 20px;
          text-align: center;
        }
        .rd-cook-step-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand);
          margin-bottom: 24px;
        }
        .rd-cook-step-text {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 400;
          line-height: 1.55;
          max-width: 640px;
          margin-bottom: 20px;
          color: #fff;
        }
        .rd-timer-lg {
          font-size: 0.875rem;
          padding: 6px 16px;
          margin-bottom: 0;
        }
        .rd-keyboard-hint {
          margin-top: 32px;
          font-size: 0.75rem;
          color: var(--brand-muted);
          opacity: 0.6;
        }

        /* Bottom bar */
        .rd-cook-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 48px;
          border-top: 0.5px solid rgba(150, 80, 30, 0.1);
          background: var(--surface-warm);
          height: 72px;
        }
        .rd-cook-nav-btn {
          padding: 9px 20px;
          border-radius: var(--radius-pill);
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          transition: background var(--transition-fast), opacity var(--transition-fast);
          white-space: nowrap;
        }
        .rd-cook-nav-btn:disabled { opacity: 0.3; cursor: default; }
        .rd-cook-nav-btn.primary {
          background: var(--brand);
          color: #fff;
          border-color: var(--brand);
        }
        .rd-cook-nav-btn.primary:not(:disabled):hover {
          background: var(--brand-hover);
        }
        .rd-cook-progress { flex: 1; }
        .rd-progress-track {
          height: 4px;
          background: rgba(150, 80, 30, 0.12);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .rd-progress-fill {
          height: 100%;
          background: var(--brand);
          border-radius: 2px;
          transition: width var(--transition-slow);
        }
        .rd-progress-label {
          font-size: 0.75rem;
          color: var(--brand-muted);
        }

        /* ── Responsive ──────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .rd-hero { flex-direction: column; padding: 24px 20px; gap: 20px; }
          .rd-hero-img { width: 100%; height: 200px; }
          .rd-tab-bar { padding: 0 20px; overflow-x: auto; }
          .rd-content { padding: 20px 20px 40px; }
          .rd-two-col { grid-template-columns: 1fr; gap: 24px; }
          .rd-cook-main { padding: 60px 24px 20px; }
          .rd-cook-bar { padding: 14px 20px; }
        }
      `}</style>
    </div>
  );
}

