import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableIngredient({ id, value, onChange, onRemove, index, canRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`ii-row ${isDragging ? 'dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="ii-drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
      >
        ⠿
      </button>

      {/* Number */}
      {/*<span className="ii-index">{index + 1}</span>*/}

      {/* Input */}
      <input
        type="text"
        className="ii-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. 2 cloves garlic"
      />

      {/* Remove */}
      {canRemove && (
        <button type="button" className="ii-remove-btn" onClick={onRemove} title="Remove">
          ×
        </button>
      )}
    </div>
  );
}

export function IngredientInput({ ingredients, onChange }) {
  const add    = () => onChange([...ingredients, '']);
  const remove = (i) => onChange(ingredients.filter((_, idx) => idx !== i));
  const update = (i, v) => { const a = [...ingredients]; a[i] = v; onChange(a); };

  return (
    <div className="ii-root">
      <div className="ii-section-label">Ingredients</div>

      <div className="ii-list">
        {ingredients.map((ing, i) => (
          <SortableIngredient
            key={`item-${i}`}
            id={`item-${i}`}
            index={i}
            value={ing}
            onChange={v => update(i, v)}
            onRemove={() => remove(i)}
            canRemove={ingredients.length > 1}
          />
        ))}
      </div>

      <button type="button" className="ii-add-btn" onClick={add}>
        + Add ingredient
      </button>

      <style>{`
        .ii-root { margin-bottom: 4px; }
        .ii-section-label {
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 10px;
          color: var(--brand-muted);
        }
        .ii-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }

        .ii-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px 6px 6px;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          border-radius: var(--radius-sm);
          background: transparent;
          cursor: grab;
          transition: box-shadow var(--transition-fast), opacity var(--transition-fast);
        }
        .ii-row:hover { border-color: rgba(150, 80, 30, 0.25); }
        .ii-row.dragging { opacity: 0.5; box-shadow: var(--shadow-hover); }

        .ii-drag-handle {
          background: transparent;
          border: none;
          color: var(--brand-muted);
          font-size: 1rem;
          cursor: grab;
          padding: 2px 4px;
          opacity: 0.4;
          transition: opacity var(--transition-fast);
          line-height: 1;
          flex-shrink: 0;
        }
        .ii-row:hover .ii-drag-handle { opacity: 0.8; }
        .ii-drag-handle:active { cursor: grabbing; }

        .ii-index {
          font-size: 0.75rem;
          color: var(--brand-muted);
          min-width: 16px;
          text-align: right;
          flex-shrink: 0;
        }
        .ii-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--brand-muted);
          padding: 2px 0;
        }
        .ii-input:focus { outline: none; }
        .ii-input::placeholder { color: var(--brand-muted); opacity: 0.5; }

        .ii-remove-btn {
          background: transparent;
          border: none;
          color: var(--brand-muted);
          font-size: 1.1rem;
          line-height: 1;
          padding: 2px 4px;
          opacity: 0;
          transition: opacity var(--transition-fast), color var(--transition-fast);
          flex-shrink: 0;
        }
        .ii-row:hover .ii-remove-btn { opacity: 1; }
        .ii-remove-btn:hover { color: #c0392b; }

        .ii-add-btn {
          background: transparent;
          border: 1px dashed rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-sm);
          color: var(--brand);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 7px 16px;
          width: 100%;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .ii-add-btn:hover { background: var(--brand-light); border-color: var(--brand); }
      `}</style>
    </div>
  );
}

/*import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button.jsx';

function SortableIngredient({ id, value, onChange, onRemove, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="d-flex align-items-center gap-2 mb-2 p-2 border rounded"
    >
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary border-0 p-1"
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab' }}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </button>

      <span className="text-muted me-2">{index + 1}.</span>

      <input
        type="text"
        className="form-control form-control-sm flex-grow-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter ingredient..."
      />

      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={onRemove}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

export function IngredientInput({ ingredients, onChange }) {
  const addIngredient = () => {
    onChange([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      onChange(newIngredients);
    }
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    onChange(newIngredients);
  };

  return (
    <div className="form-group">
      <label className="form-label fw-bold">Ingredients *</label>
      <div className="mb-3">
        {ingredients.map((ingredient, index) => (
          <SortableIngredient
            key={`item-${index}`}
            id={`item-${index}`}
            value={ingredient}
            onChange={(value) => updateIngredient(index, value)}
            onRemove={() => removeIngredient(index)}
            index={index}
          />
        ))}
      </div>
      <Button
        type="button"
        variant="success"
        size="small"
        onClick={addIngredient}
      >
        <FontAwesomeIcon icon={faPlus} className="me-1" />
        Add Ingredient
      </Button>
    </div>
  );
}*/