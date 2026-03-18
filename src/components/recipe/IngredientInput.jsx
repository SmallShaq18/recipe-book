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
