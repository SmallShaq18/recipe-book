import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { toast } from 'react-toastify';

export function ShoppingList({ selectedRecipes = [], onClose }) {
  const { recipes } = useRecipes();
  const location = useLocation();
  const navigate = useNavigate();

  const queryIds = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get('ids');
    if (!ids) return [];
    return ids.split(',').map(id => id.trim()).filter(Boolean);
  }, [location.search]);

  const resolvedRecipes = useMemo(() => {
    if (selectedRecipes && selectedRecipes.length > 0) return selectedRecipes;
    if (queryIds.length === 0) return [];
    return queryIds
      .map(id => recipes.find(r => String(r.id) === id))
      .filter(Boolean);
  }, [selectedRecipes, queryIds, recipes]);

  const recipesToShow = resolvedRecipes;

  const [checked, setChecked] = useState(new Set());

  const items = useMemo(() => {
    const all = recipesToShow.flatMap(r => r.ingredients || []);
    const unique = all.filter((ing, i, arr) =>
      arr.findIndex(x => x.toLowerCase().trim() === ing.toLowerCase().trim()) === i
    );
    return unique.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [recipesToShow]);

  const toggle = (item) => {
    const next = new Set(checked);
    next.has(item) ? next.delete(item) : next.add(item);
    setChecked(next);
  };

  const copyToClipboard = () => {
    const unchecked = items.filter(i => !checked.has(i)).join('\n');
    try {
      //await navigator.clipboard.writeText(unchecked);
      toast.success('Shopping list copied!');
    } catch {
      const el = document.createElement('textarea');
      el.value = unchecked;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success('Shopping list copied!');
    }
  };

  const done  = checked.size;
  const total = items.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  if (recipesToShow.length === 0) {
    return (
      <div className="sl-empty">
        <span className="sl-empty-icon">🛒</span>
        <h4 className="sl-empty-title">No recipes selected</h4>
        <p className="sl-empty-sub">Select recipes in the Recipes page, then click the shopping cart button.</p>
        <button
          className="sl-btn sl-outline"
          onClick={() => navigate('/recipes')}
        >
          Go to Recipes
        </button>
        <style>{slStyles}</style>
      </div>
    );
  }

  return (
    <div className="sl-root m-5">
      {/* Header */}
      <div className="sl-header">
        <h3 className="sl-title">Shopping list</h3>
        <div className="sl-header-actions">
          <button
            className="sl-btn sl-outline"
            onClick={copyToClipboard}
            disabled={items.length === 0}
          >
            Copy list
          </button>
          {onClose && (
            <button className="sl-btn sl-ghost" onClick={onClose}>Close</button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="sl-progress-wrap">
        <div className="sl-progress-track">
          <div className="sl-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="sl-progress-label">{done} of {total} items</span>
      </div>

      {/* Items */}
      <div className="sl-items">
        {items.length === 0 ? (
          <p className="sl-no-items">No ingredients found in selected recipes.</p>
        ) : (
          items.map((ing, i) => {
            const isDone = checked.has(ing);
            return (
              <div
                key={i}
                className={`sl-item ${isDone ? 'done' : ''}`}
                onClick={() => toggle(ing)}
              >
                <span className="sl-check">{isDone ? '✓' : ''}</span>
                <span className="sl-ing-name">{ing}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Recipe tags */}
      <div className="sl-recipe-tags">
        <span className="sl-tags-label">From:</span>
        {recipesToShow.map(r => (
          <span key={r.id} className="sl-recipe-tag">{r.name}</span>
        ))}
      </div>

      <style>{slStyles}</style>
    </div>
  );
}

const slStyles = `
  .sl-root { }

  /* Header */
  .sl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .sl-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--brand);
  }
  .sl-header-actions { display: flex; gap: 8px; }
  .sl-btn {
    padding: 7px 16px;
    border-radius: var(--radius-pill);
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background var(--transition-fast), border-color var(--transition-fast);
  }
  .sl-outline {
    background: transparent;
    border: 0.5px solid rgba(150, 80, 30, 0.2);
    color: var(--brand);
  }
  .sl-outline:hover:not(:disabled) { background: var(--brand-light); border-color: var(--brand); }
  .sl-outline:disabled { opacity: 0.4; cursor: not-allowed; }
  .sl-ghost {
    background: transparent;
    border: 0.5px solid rgba(150, 80, 30, 0.15);
    color: var(--brand-muted);
  }
  .sl-ghost:hover { background: var(--brand-light); }

  /* Progress */
  .sl-progress-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .sl-progress-track {
    flex: 1;
    height: 3px;
    background: rgba(150, 80, 30, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .sl-progress-fill {
    height: 100%;
    background: var(--brand);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .sl-progress-label {
    font-size: 0.75rem;
    color: var(--brand-muted);
    white-space: nowrap;
  }

  /* Items */
  .sl-items { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
  .sl-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background var(--transition-fast);
    color: var(--brand);
  }
  .sl-item:hover { background: var(--brand-light); color: white; }
  .sl-item.done { opacity: 0.45; }
  .sl-check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 0.5px solid rgba(150, 80, 30, 0.25);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    color: #fff;
    background: transparent;
    transition: background var(--transition-fast), border-color var(--transition-fast);
  }
  .sl-item.done .sl-check { background: var(--brand); border-color: var(--brand); }
  .sl-ing-name {
    font-size: 0.875rem;
    flex: 1;
    line-height: 1.4;
  }
  .sl-item.done .sl-ing-name { text-decoration: line-through; }
  .sl-no-items {
    font-size: 0.875rem;
    color: var(--brand-muted);
    text-align: center;
    padding: 24px 0;
  }

  /* Recipe tags */
  .sl-recipe-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 16px;
    border-top: 0.5px solid rgba(150, 80, 30, 0.1);
  }
  .sl-tags-label {
    font-size: 0.75rem;
    color: var(--brand-muted);
  }
  .sl-recipe-tag {
    font-size: 0.75rem;
    background: var(--brand-light);
    color: var(--brand);
    padding: 3px 10px;
    border-radius: var(--radius-pill);
  }

  /* Empty state */
  .sl-empty {
    text-align: center;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .sl-empty-icon { font-size: 2rem; opacity: 0.4; }
  .sl-empty-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 500;
  }
  .sl-empty-sub {
    font-size: 0.875rem;
    color: var(--brand-muted);
    margin-bottom: 8px;
  }`
