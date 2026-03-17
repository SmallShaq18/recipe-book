import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { IngredientInput } from './IngredientInput.jsx';
import { InstructionInput } from './InstructionInput.jsx';
import { ImageUploader } from './ImageUploader.jsx';
import { validateRecipe } from '../../utils/recipeUtils.js';

const INITIAL = {
  name: '', category: 'breakfast', prep: '', cook: '',
  servings: '', pic: '', ingredients: [''], instructions: [''],
};

export function RecipeForm({ recipe, mode = 'create', onSubmit, onCancel }) {
  const [form,        setForm]        = useState(INITIAL);
  const [errors,      setErrors]      = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (mode === 'edit' && recipe) {
      setForm({
        name:         recipe.name         || '',
        category:     recipe.category     || 'breakfast',
        prep:         recipe.prep         || '',
        cook:         recipe.cook         || '',
        servings:     recipe.servings     || '',
        pic:          recipe.pic          || '',
        ingredients:  recipe.ingredients?.length ? recipe.ingredients : [''],
        instructions: recipe.instructions?.length ? recipe.instructions : [''],
      });
    }
  }, [recipe, mode]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleDragEnd = (event, field) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = form[field].findIndex((_, i) => `item-${i}` === active.id);
    const newIdx = form[field].findIndex((_, i) => `item-${i}` === over.id);
    setForm(prev => ({ ...prev, [field]: arrayMove(prev[field], oldIdx, newIdx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errs = validateRecipe(form);
    if (errs.length > 0) { setErrors(errs); setIsSubmitting(false); return; }
    try {
      await onSubmit(form);
      toast.success(`Recipe ${mode === 'create' ? 'added' : 'updated'}!`);
      navigate('/recipes');
    } catch {
      toast.error('Failed to save recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => (onCancel ? onCancel() : navigate('/recipes'));

  return (
    <form className="rf-form" onSubmit={handleSubmit}>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rf-errors">
          {errors.map((err, i) => <div key={i} className="rf-error-item">{err}</div>)}
        </div>
      )}

      {/* ── Basic info ───────────────────────────────────────────────── */}
      <div className="rf-section-label">Basic info</div>

      <div className="rf-row-2">
        <div className="rf-field">
          <label className="rf-label" htmlFor="rf-name">
            Recipe name <span className="rf-required">*</span>
          </label>
          <input
            id="rf-name" type="text" className="rf-input"
            placeholder="e.g. Coconut rice"
            value={form.name} onChange={e => set('name', e.target.value)} required
          />
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="rf-cat">Category</label>
          <select id="rf-cat" className="rf-input rf-select" value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
      </div>

      {/* ── Timing ───────────────────────────────────────────────────── */}
      <div className="rf-section-label">Timing &amp; servings</div>

      <div className="rf-row-3">
        <div className="rf-field">
          <label className="rf-label" htmlFor="rf-prep">Prep time</label>
          <input id="rf-prep" type="text" className="rf-input" placeholder="e.g. 15 min"
            value={form.prep} onChange={e => set('prep', e.target.value)} />
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="rf-cook">Cook time</label>
          <input id="rf-cook" type="text" className="rf-input" placeholder="e.g. 45 min"
            value={form.cook} onChange={e => set('cook', e.target.value)} />
        </div>
        <div className="rf-field">
          <label className="rf-label" htmlFor="rf-serv">Servings</label>
          <input id="rf-serv" type="number" min="1" className="rf-input" placeholder="e.g. 4"
            value={form.servings} onChange={e => set('servings', e.target.value)} />
        </div>
      </div>

      {/* ── Photo ────────────────────────────────────────────────────── */}
      <div className="rf-section-label">Photo</div>
      <ImageUploader image={form.pic} onImageChange={v => set('pic', v)} />

      {/* ── Ingredients (drag-and-drop) ───────────────────────────── */}
      <div className="rf-section-label" style={{ marginTop: 24 }}>Ingredients</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={e => handleDragEnd(e, 'ingredients')}
      >
        <SortableContext
          items={form.ingredients.map((_, i) => `item-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <IngredientInput
            ingredients={form.ingredients}
            onChange={v => set('ingredients', v)}
          />
        </SortableContext>
      </DndContext>

      {/* ── Instructions (drag-and-drop) ─────────────────────────── */}
      <div className="rf-section-label" style={{ marginTop: 24 }}>Instructions</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={e => handleDragEnd(e, 'instructions')}
      >
        <SortableContext
          items={form.instructions.map((_, i) => `item-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <InstructionInput
            instructions={form.instructions}
            onChange={v => set('instructions', v)}
          />
        </SortableContext>
      </DndContext>

      {/* ── Submit row ───────────────────────────────────────────────── */}
      <div className="rf-submit-row">
        <button type="button" className="rf-cancel-btn" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="rf-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : mode === 'create' ? 'Add Recipe' : 'Update Recipe'}
        </button>
      </div>

      <style>{`
        .rf-form { padding-bottom: 32px; }

        /* Errors */
        .rf-errors {
          background: var(--brand-light);
          border: 0.5px solid rgba(192, 57, 43, 0.25);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        .rf-error-item {
          font-size: 0.875rem;
          color: #c0392b;
          padding: 3px 0;
        }

        /* Section label */
        .rf-section-label {
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brand-muted);
          padding-bottom: 8px;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.12);
          margin-bottom: 16px;
          margin-top: 24px;
        }

        /* Layout grids */
        .rf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .rf-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

        /* Fields */
        .rf-field { margin-bottom: 0; }
        .rf-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--brand-muted);
        }
        .rf-required { color: var(--brand); }
        .rf-input {
          width: 100%;
          padding: 10px 14px;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-sm);
          
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: inherit;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .rf-input:focus {
          outline: none;
          border-color: var(--brand);
          box-shadow: 0 0 0 3px var(--brand-light);
        }
        .rf-select { appearance: none; cursor: pointer; }

        /* Submit row */
        .rf-submit-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .rf-cancel-btn {
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--brand-muted);
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .rf-cancel-btn:hover:not(:disabled) { background: var(--brand-light); color: var(--brand); }
        .rf-submit-btn {
          padding: 10px 28px;
          border-radius: var(--radius-pill);
          border: none;
          background: var(--brand);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          min-width: 140px;
          cursor: pointer;
          transition: background var(--transition-fast), opacity var(--transition-fast);
        }
        .rf-submit-btn:hover:not(:disabled) { background: var(--brand-hover); }
        .rf-submit-btn:disabled, .rf-cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Responsive */
        @media (max-width: 480px) {
          .rf-row-2, .rf-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}

