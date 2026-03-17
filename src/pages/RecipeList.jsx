import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useConfirm } from '../hooks/useConfirm.js';
import { RecipeCard } from '../components/recipe/RecipeCard.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'az', label: 'A – Z' },
  { value: 'quick', label: 'Quickest' },
];

export default function RecipeList() {
  const { recipes, deleteRecipe } = useRecipes();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [searchRaw, setSearchRaw] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [smartOpen, setSmartOpen] = useState(false);
  const [smartInput, setSmartInput] = useState('');
  const [smartActive, setSmartActive] = useState(false);
  const [smartIngredients, setSmartIngredients] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());

  const searchQuery = useDebounce(searchRaw, 300);

  const handleDelete = (recipeId) => {
    confirm.confirm(
      'Delete this recipe? This cannot be undone.',
      () => {
        deleteRecipe(recipeId);
        toast.success('Recipe deleted!');
      }
    );
  };

  const toggleRecipeSelection = useCallback((recipeId) => {
    setSelectedRecipes(prev => {
      const next = new Set(prev);
      next.has(recipeId) ? next.delete(recipeId) : next.add(recipeId);
      return next;
    });
  }, []);


  const handleSmartSearch = () => {
    const terms = smartInput
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    setSmartIngredients(terms);
    setSmartActive(terms.length > 0);
  };

  const clearSmart = () => {
    setSmartInput('');
    setSmartIngredients([]);
    setSmartActive(false);
  };

  const clearSelections = () => {
    setSelectedRecipes(new Set());
  };

  const filteredRecipes = useMemo(() => {
    let list = [...recipes];
    

    if (smartActive && smartIngredients.length > 0) {
      list = list.filter(r =>
        smartIngredients.every(term =>
          (r.ingredients || []).some(ing => ing.toLowerCase().includes(term))
        )
      );
    }

    if (category !== 'All') {
      list = list.filter(r => r.category?.toLowerCase() === category.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(r =>
        r.name?.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'az') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'quick') {
      const parseMin = str => {
        if (!str) return Infinity;
        const m = str.match(/(\d+)/);
        return m ? parseInt(m[1]) : Infinity;
      };
      list.sort((a, b) => parseMin(a.cook) - parseMin(b.cook));
    } else {
      list.sort((a, b) => (String(b.id) > String(a.id) ? 1 : -1));
    }

    return list;
  }, [recipes, searchQuery, category, sortOrder, smartIngredients, smartActive]);

  const isFiltered = category !== 'All' || searchQuery.trim() || smartActive;

  return (
    <div className="container py-4">
      {/* Header Section with Shopping List Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 600,
            marginBottom: '0.25rem',
            margin: 0
          }}>
            Recipes
          </h1>
          <p style={{
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: 'var(--brand-muted)',
            margin: 0
          }}>
            {recipes.length} recipes in collection
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{
            fontSize: '0.85rem',
            fontStyle: 'italic',
            display: 'none',
            maxWidth: 'none'
          }} className="d-none d-sm-inline">
            Sort by:
          </label>
          <select
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'white',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              boxShadow: 'var(--shadow-card)'
            }}
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {selectedRecipes.size > 0 && (
            <button
              onClick={() => {
                const ids = Array.from(selectedRecipes).join(',');
                navigate(`/shopping-list?ids=${encodeURIComponent(ids)}`);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--brand)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => e.target.style.backgroundColor = 'var(--brand-hover)'}
              onMouseOut={e => e.target.style.backgroundColor = 'var(--brand)'}
            >
              🛒 ({selectedRecipes.size})
            </button>
          )}
        </div>
      </div>

      {/* Toolbar & Search */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {/*<span style={{ padding: '0 0.75rem', color: 'var(--brand-muted)' }}>🔍</span>*/}
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchRaw}
            onChange={e => setSearchRaw(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              padding: '0.75rem',
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}
          />
          {searchRaw && (
            <button
              onClick={() => setSearchRaw('')}
              style={{
                padding: '0 0.75rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setSmartOpen(!smartOpen)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          Smart Search <FontAwesomeIcon icon={faSlidersH} style={{ marginLeft: '0.5rem' }} />
         {smartActive ? `(${filteredRecipes.length})` : ''}
        </button>
      </div>

      {/* Category Selection */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: category === cat ? 'var(--brand)' : 'var(--brand-light)',
              color: 'white',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
              boxShadow: category === cat ? 'var(--shadow-card)' : 'none'
            }}
            onMouseOver={e => {
              if (category !== cat) e.target.style.backgroundColor = 'var(--surface-warm)';
            }}
            onMouseOut={e => {
              if (category !== cat) e.target.style.backgroundColor = 'var(--brand-light)';
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shopping List Hint */}
      <div style={{
          backgroundColor: 'var(--brand-light)',
          border: '1px solid var(--brand)',
          borderRadius: 'var(--radius-card)',
          padding: '0.75rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)',
          color: 'white',
        }}>
        Select recipes and then click the 🛒 icon above to add to your shopping list. You have selected {selectedRecipes.size} recipes.
      </div>

      {/* Smart Match Collapsible Panel */}
      {smartOpen && (
        <div style={{
          backgroundColor: 'var(--brand-light)',
          border: '1px solid var(--brand)',
          borderRadius: 'var(--radius-card)',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)'
        }}>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--brand-muted)',
            marginBottom: '1rem',
            margin: '0 0 1rem 0'
          }}>
            Find recipes based on what's in your pantry.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
            <input
              type="text"
              placeholder="e.g. tomatoes, onion, palm oil"
              value={smartInput}
              onChange={e => setSmartInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSmartSearch()}
              style={{
                flex: '1 1 200px',
                padding: '0.75rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'inherit',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={handleSmartSearch}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--brand)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                flexShrink: 0
              }}
              onMouseOver={e => e.target.style.backgroundColor = 'var(--brand-hover)'}
              onMouseOut={e => e.target.style.backgroundColor = 'var(--brand)'}
            >
              Find
            </button>
            {smartActive && (
              <button
                onClick={clearSmart}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--brand)',
                  border: '1px solid var(--brand)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  flexShrink: 0
                }}
                onMouseOver={e => e.target.style.backgroundColor = 'var(--brand-light)'}
                onMouseOut={e => e.target.style.backgroundColor = 'transparent'}
              >
                Clear
              </button>
            )}
          </div>
          {smartActive && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--brand)',
              fontWeight: 500,
              margin: 0
            }}>
              Showing matching results for: {smartIngredients.join(', ')}
            </p>
          )}
        </div>
      )}


      {/* Recipe Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {filteredRecipes.map((recipe, index) => (
          <div key={recipe.id} style={{ position: 'relative' }}>
            {/* Selection Checkbox */}
            <label style={{
              position: 'absolute',
              bottom: '3.5rem',
              right: '0.75rem',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'transparent',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}>
              <input
                type="checkbox"
                checked={selectedRecipes.has(recipe.id)}
                onChange={() => toggleRecipeSelection(recipe.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: 'var(--brand)'
                }}
              />
            </label>

            <RecipeCard
              recipe={recipe}
              onDelete={handleDelete}
              index={index}
            />
          </div>
        ))}

        {/* Ghost Add Card */}
        <Link
          to="/addRecipe"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            backgroundColor: 'transparent',
            borderRadius: 'var(--radius-card)',
            border: '2px dashed var(--brand)',
            minHeight: '260px',
            transition: 'var(--transition-fast)',
            cursor: 'pointer'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--surface-warm)'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--brand-light)'}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>+</div>
          <span style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Add a recipe</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--brand-muted)' }}>From scratch</span>
        </Link>
      </div>

      {/* Empty States */}
      {filteredRecipes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>
            🍳
          </div>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--brand-muted)',
            marginBottom: '2rem'
          }}>
            {recipes.length === 0
              ? 'Your recipe book is empty!'
              : isFiltered
                ? 'No matches found. Try adjusting your filters.'
                : 'Nothing to see here.'}
          </p>
          {isFiltered ? (
            <button
              onClick={() => { setSearchRaw(''); setCategory('All'); clearSmart(); }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--brand-light)',
                color: 'var(--brand)',
                border: '1px solid var(--brand)',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={e => {
                e.target.style.backgroundColor = 'var(--brand)';
                e.target.style.color = 'white';
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = 'var(--brand-light)';
                e.target.style.color = 'var(--brand)';
              }}
            >
              Clear all filters
            </button>
          ) : recipes.length === 0 && (
            <Link
              to="/addRecipe"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--brand)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 500,
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={e => e.style.backgroundColor = 'var(--brand-hover)'}
              onMouseOut={e => e.style.backgroundColor = 'var(--brand)'}
            >
              Add your first recipe
            </Link>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancel}
        onClose={confirm.close}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
