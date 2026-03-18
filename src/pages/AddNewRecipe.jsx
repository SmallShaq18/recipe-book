import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddNewRecipe({ recipes, setRecipes }) {
  return (
    <div className="af-root">
      <AddNewForm recipes={recipes} setRecipes={setRecipes} />
    </div>
  );
}

function AddNewForm({ recipes, setRecipes }) {
  const [nameVal,         setNameVal]         = useState('');
  const [categoryVal,     setCategoryVal]     = useState('breakfast');
  const [prepVal,         setPrepVal]         = useState('');
  const [cookVal,         setCookVal]         = useState('');
  const [servingsVal,     setServingsVal]     = useState('');
  const [picVal,          setPicVal]          = useState('');
  const [ingredientsVal,  setIngredientsVal]  = useState('');
  const [instructionsVal, setInstructionsVal] = useState('');
  const [saving,          setSaving]          = useState(false);

  const navigate = useNavigate();
  const MAX_IMAGE_SIZE = 500 * 1024;

  function isLocalStorageNearLimit(thresholdMB = 4.5) {
    let total = 0;
    for (let key of Object.keys(localStorage)) {
      const item = localStorage.getItem(key);
      if (item) total += item.length * 2;
    }
    return total / (1024 * 1024) >= thresholdMB;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image too large — please keep it under 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPicVal(reader.result);
    reader.readAsDataURL(file);
  };

  function handleAddRecipe(e) {
    e.preventDefault();
    if (!nameVal.trim()) { toast.error('Please fill in the recipe name.'); return; }

    const ingredientsArr = Array.isArray(ingredientsVal)
      ? ingredientsVal
      : ingredientsVal.split(/,|\n/).map(s => s.trim()).filter(Boolean);

    const instructionsArr = Array.isArray(instructionsVal)
      ? instructionsVal
      : instructionsVal.split(/,|\n/).map(s => s.trim()).filter(Boolean);

    if (ingredientsArr.length === 0 || instructionsArr.length === 0) {
      toast.warn('Tip: add ingredients and instructions to complete your recipe later.');
    }

    if (isLocalStorageNearLimit(4.5)) {
      toast.warning('Storage is almost full. Consider deleting old recipes.');
    }

    const newRecipe = {
      id: String(Date.now()),
      name: nameVal, category: categoryVal,
      ingredients: ingredientsArr, instructions: instructionsArr,
      pic: picVal, prep: prepVal, cook: cookVal, servings: servingsVal,
    };

    setSaving(true);
    setRecipes(prev => [...prev, newRecipe]);
    toast.success('Recipe added!');
    setTimeout(() => navigate('/recipes'), 1800);
  }

  const descLength = instructionsVal.length;

  return (
    <>
      <div className="af-header">
        <Link to="/recipes" className="af-back">← Recipes</Link>
        <div>
          <h1 className="af-page-title">Add a recipe</h1>
          <p className="af-page-sub">Fill in what you know — you can always edit it later</p>
        </div>
      </div>

      <form className="af-form" onSubmit={handleAddRecipe}>

        {/* ── Basic info ─────────────────────────────────────────────── */}
        <div className="af-section-label">Basic info</div>

        <div className="af-field">
          <label className="af-label" htmlFor="name">Recipe name <span className="af-required">*</span></label>
          <input
            id="name" type="text" className="af-input"
            placeholder="e.g. Coconut rice"
            value={nameVal} onChange={e => setNameVal(e.target.value)}
            required
          />
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="category">Category</label>
          <select id="category" className="af-input af-select" value={categoryVal} onChange={e => setCategoryVal(e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        {/* ── Timing ─────────────────────────────────────────────────── */}
        <div className="af-section-label">Timing &amp; servings</div>

        <div className="af-row-3">
          <div className="af-field">
            <label className="af-label" htmlFor="prep">Prep time</label>
            <input id="prep" type="text" className="af-input" placeholder="e.g. 15 min"
              value={prepVal} onChange={e => setPrepVal(e.target.value)} />
          </div>
          <div className="af-field">
            <label className="af-label" htmlFor="cook">Cook time</label>
            <input id="cook" type="text" className="af-input" placeholder="e.g. 45 min"
              value={cookVal} onChange={e => setCookVal(e.target.value)} />
          </div>
          <div className="af-field">
            <label className="af-label" htmlFor="servings">Servings</label>
            <input id="servings" type="number" min="1" className="af-input" placeholder="e.g. 4"
              value={servingsVal} onChange={e => setServingsVal(e.target.value)} />
          </div>
        </div>

        {/* ── Image ──────────────────────────────────────────────────── */}
        <div className="af-section-label">Photo</div>

        <div className="af-image-area">
          <div className="af-image-preview">
            {picVal
              ? <img src={picVal} alt="Preview" />
              : (
                <div className="af-image-placeholder">
                  <span className="af-camera-icon">📷</span>
                  <span>Add photo</span>
                </div>
              )
            }
          </div>
          <div className="af-image-right">
            <label className="af-upload-btn" htmlFor="image-upload">
              Choose image
              <input
                id="image-upload" type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handleImageUpload}
              />
            </label>
            <p className="af-image-hint">JPG or PNG · max 500 KB</p>
          </div>
        </div>

        {/* ── Ingredients ────────────────────────────────────────────── */}
        <div className="af-section-label">Ingredients</div>

        <div className="af-field">
          <label className="af-label" htmlFor="ingredients">
            One per line, or comma-separated
          </label>
          <textarea
            id="ingredients" className="af-input af-textarea"
            placeholder={'500g chicken breast\n2 cloves garlic\n1 lemon'}
            rows={6}
            value={ingredientsVal} onChange={e => setIngredientsVal(e.target.value)}
          />
        </div>

        {/* ── Instructions ───────────────────────────────────────────── */}
        <div className="af-section-label">Instructions</div>

        <div className="af-field">
          <label className="af-label" htmlFor="instructions">
            One step per line, or comma-separated
          </label>
          <textarea
            id="instructions" className="af-input af-textarea"
            placeholder={'Preheat oven to 200°C.\nSeason the chicken with salt and pepper.\nRoast for 35–40 minutes until golden.'}
            rows={7}
            value={instructionsVal} onChange={e => setInstructionsVal(e.target.value)}
          />
          <span className={`af-char-count ${descLength > 280 ? 'warn' : ''}`}>
            {descLength} / 300
          </span>
        </div>

        {/* ── Submit ─────────────────────────────────────────────────── */}
        <div className="af-submit-row">
          <Link to="/recipes" className="af-cancel-btn">Cancel</Link>
          <button type="submit" className="af-submit-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Add Recipe'}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />

      <style>{`
        /* ── Root ─────────────────────────────────────────────────────────── */
        .af-root {
          min-height: 100vh;
          padding-bottom: 64px;
        }

        /* ── Header ───────────────────────────────────────────────────────── */
        .af-header {
          padding: 28px 48px 0;
          margin-bottom: 32px;
        }
        .af-back {
          display: inline-block;
          font-size: 0.8125rem;
          color: var(--brand-muted);
          margin-bottom: 12px;
          transition: color var(--transition-fast);
        }
        .af-back:hover { color: var(--brand); }
        .af-page-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .af-page-sub {
          font-size: 0.875rem;
          color: var(--brand-muted);
        }

        /* ── Form ─────────────────────────────────────────────────────────── */
        .af-form {
          max-width: 640px;
          padding: 0 48px;
        }

        /* Section label */
        .af-section-label {
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-muted);
          padding-bottom: 8px;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.12);
          margin-bottom: 16px;
          margin-top: 28px;
        }
        .af-section-label:first-of-type { margin-top: 0; }

        /* Fields */
        .af-field { margin-bottom: 16px; }
        .af-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .af-required { color: var(--brand); }
        .af-input {
          width: 100%;
          padding: 10px 14px;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-sm);
          background: var(--surface-card);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .af-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-light);
        }
        .af-select { appearance: none; cursor: pointer; }
        .af-textarea { resize: vertical; line-height: 1.6; }

        /* Three-column row */
        .af-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 0;
        }

        /* Char counter */
        .af-char-count {
          display: block;
          text-align: right;
          font-size: 0.75rem;
          color: var(--brand-muted);
          margin-top: 4px;
          transition: color var(--transition-fast);
        }
        .af-char-count.warn { color: var(--brand); }

        /* Image area */
        .af-image-area {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        .af-image-preview {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          flex-shrink: 0;
        }
        .af-image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .af-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--surface-warm-deep);
        }
        .af-camera-icon { font-size: 1.25rem; }
        .af-image-placeholder span:last-child {
          font-size: 0.6875rem;
          color: var(--brand-muted);
        }
        .af-image-right { display: flex; flex-direction: column; gap: 8px; }
        .af-upload-btn {
          display: inline-block;
          padding: 8px 16px;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-pill);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          background: var(--surface-warm);
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .af-upload-btn:hover { background: var(--brand-light); border-color: var(--brand); color: var(--brand); }
        .af-image-hint { font-size: 0.75rem; color: var(--brand-muted); }

        /* Submit row */
        .af-submit-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .af-cancel-btn {
          padding: 10px 18px;
          border-radius: var(--radius-pill);
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          font-size: 0.875rem;
          color: var(--brand-muted);
          background: transparent;
          transition: background var(--transition-fast);
        }
        .af-cancel-btn:hover { background: var(--brand-light); }
        .af-submit-btn {
          padding: 10px 28px;
          border-radius: var(--radius-pill);
          border: none;
          background: var(--brand);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          min-width: 140px;
          transition: background var(--transition-fast), opacity var(--transition-fast);
        }
        .af-submit-btn:hover:not(:disabled) { background: var(--brand-hover); }
        .af-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Responsive ───────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .af-header { padding: 20px 20px 0; }
          .af-form { padding: 0 20px; }
          .af-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}

