import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableInstruction({ id, value, onChange, onRemove, index, canRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`inst-row ${isDragging ? 'dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="inst-row-top">
        <button
          type="button"
          className="inst-drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          ⠿
        </button>
        <span className="inst-step-badge">Step {index + 1}</span>
        {canRemove && (
          <button type="button" className="inst-remove-btn" onClick={onRemove} title="Remove step">
            ×
          </button>
        )}
      </div>
      <textarea
        className="inst-textarea"
        rows={2}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Describe this cooking step…"
      />
    </div>
  );
}

export function InstructionInput({ instructions, onChange }) {
  const add    = () => onChange([...instructions, '']);
  const remove = (i) => onChange(instructions.filter((_, idx) => idx !== i));
  const update = (i, v) => { const a = [...instructions]; a[i] = v; onChange(a); };

  return (
    <div className="inst-root">
      <div className="inst-section-label">Instructions</div>

      <div className="inst-list">
        {instructions.map((inst, i) => (
          <SortableInstruction
            key={`item-${i}`}
            id={`item-${i}`}
            index={i}
            value={inst}
            onChange={v => update(i, v)}
            onRemove={() => remove(i)}
            canRemove={instructions.length > 1}
          />
        ))}
      </div>

      <button type="button" className="inst-add-btn" onClick={add}>
        + Add step
      </button>

      <style>{`
        .inst-root { margin-bottom: 4px; }
        .inst-section-label {
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 10px;
          color: var(--brand-muted);
        }
        .inst-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }

        .inst-row {
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          border-radius: var(--radius-card);
          background: transparent;
          cursor: grab;
          padding: 10px 12px 12px;
          transition: box-shadow var(--transition-fast), opacity var(--transition-fast), border-color var(--transition-fast);
        }
        .inst-row:hover { border-color: rgba(150, 80, 30, 0.25); }
        .inst-row.dragging { opacity: 0.5; box-shadow: var(--shadow-hover); }

        .inst-row-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .inst-drag-handle {
          background: transparent;
          border: none;
          color: var(--brand-muted);
          font-size: 1rem;
          cursor: grab;
          padding: 2px 4px;
          opacity: 0.4;
          transition: opacity var(--transition-fast);
          line-height: 1;
        }
        .inst-row:hover .inst-drag-handle { opacity: 0.8; }
        .inst-drag-handle:active { cursor: grabbing; }

        .inst-step-badge {
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand);
          background: transparent;
          padding: 2px 9px;
          border-radius: var(--radius-pill);
          flex: 1;
        }
        .inst-remove-btn {
          background: transparent;
          border: none;
          color: var(--brand-muted);
          font-size: 1.1rem;
          line-height: 1;
          padding: 2px 4px;
          opacity: 0;
          transition: opacity var(--transition-fast), color var(--transition-fast);
        }
        .inst-row:hover .inst-remove-btn { opacity: 1; }
        .inst-remove-btn:hover { color: #c0392b; }

        .inst-textarea {
          width: 100%;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          line-height: 1.6;
          color: var(--brand-muted);
          resize: vertical;
          padding: 0;
        }
        .inst-textarea:focus { outline: none; }
        .inst-textarea::placeholder { color: var(--brand-muted); opacity: 0.5; }

        .inst-add-btn {
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
        .inst-add-btn:hover { background: var(--brand-light); border-color: var(--brand); }
      `}</style>
    </div>
  );
}

