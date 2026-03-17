import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useConfirm } from '../hooks/useConfirm.js';
import { RecipeCard } from '../components/recipe/RecipeCard.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'az', label: 'A – Z' },
  { value: 'quick', label: 'Quickest' },
];

export default function Recipes() {
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

  const filteredRecipes = useMemo(() => {
    let list = [...recipes];

    if (smartActive && smartIngredients.length > 0) {
      list = list.filter(r =>
        smartIngredients.some(term =>
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
        r.name?.toLowerCase().includes(q) ||
        (r.ingredients || []).some(i => i.toLowerCase().includes(q))
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
      {/* Header Section */}
      <div className="row align-items-center mb-4 g-3">
        <div className="col-md-6">
          <h1 className="fw-bold mb-0">Recipes</h1>
          <p className="fst-italic small mb-0">{recipes.length} recipes in your collection</p>
        </div>
        <div className="col-md-6 text-md-end">
          <div className="d-flex justify-content-md-end align-items-center gap-3">
            <label className="small fst-italic d-none d-sm-block text-nowrap">Sort by:</label>
            <select
              className="form-select form-select-sm w-auto border-0 bg-light shadow-sm"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="row g-2 mb-3">
        <div className="col-md-8 col-lg-9">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted opacity-50"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search recipes or ingredients..."
              value={searchRaw}
              onChange={e => setSearchRaw(e.target.value)}
            />
            {searchRaw && (
              <button className="btn btn-outline-secondary border-start-0" onClick={() => setSearchRaw('')}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
        </div>
        <div className="col-md-4 col-lg-3">
          <button
            className={`btn w-100 shadow-sm border-0 ${smartActive ? 'btn-primary' : 'btn-light'}`}
            onClick={() => setSmartOpen(!smartOpen)}
          >
            <i className="bi bi-stars me-2"></i>
            Smart match {smartActive ? `(${filteredRecipes.length})` : ''}
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill px-3 transition-all ${
              category === cat ? 'btn-primary shadow' : 'btn-outline-secondary border-0 bg-light'
            }`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Smart Match Collapsible Panel */}
      {smartOpen && (
        <div className="card border-0 shadow-sm bg-light mb-4 overflow-hidden">
          <div className="card-body">
            <p className="small text-muted mb-2">
              <i className="bi bi-info-circle me-1"></i>
              Find recipes based on what's in your pantry.
            </p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="e.g. tomatoes, onion, palm oil"
                value={smartInput}
                onChange={e => setSmartInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSmartSearch()}
              />
              <button className="btn btn-primary px-4" onClick={handleSmartSearch}>Find</button>
              {smartActive && (
                <button className="btn btn-outline-danger" onClick={clearSmart}>Clear</button>
              )}
            </div>
            {smartActive && (
              <p className="small mt-2 mb-0 text-primary fw-medium">
                Showing matching results for: {smartIngredients.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredRecipes.map((recipe, index) => (
          <div className="col" key={recipe.id}>
            <RecipeCard
              recipe={recipe}
              onDelete={handleDelete}
              index={index}
            />
          </div>
        ))}

        {/* Ghost Add Card */}
        <div className="col">
          <Link 
            to="/addRecipe" 
            className="card h-100 border-2 border-dashed text-decoration-none d-flex flex-column align-items-center justify-content-center py-5 bg-light transition-hover"
            style={{ borderStyle: 'dashed', minHeight: '260px' }}
          >
            <div className="display-6 text-primary opacity-50 mb-2">+</div>
            <span className="fw-bold text-dark">Add a recipe</span>
            <span className="small text-muted">From scratch</span>
          </Link>
        </div>
      </div>

      {/* Empty States */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-5 my-4">
          <i className="bi bi-egg-fried display-1 text-muted opacity-25 mb-3"></i>
          <p className="text-muted fs-5">
            {recipes.length === 0
              ? 'Your recipe book is empty!'
              : isFiltered
                ? 'No matches found. Try adjusting your filters.'
                : 'Nothing to see here.'
            }
          </p>
          {isFiltered ? (
            <button
              className="btn btn-outline-primary rounded-pill px-4"
              onClick={() => { setSearchRaw(''); setCategory('All'); clearSmart(); }}
            >
              Clear all filters
            </button>
          ) : recipes.length === 0 && (
            <Link to="/addRecipe" className="btn btn-primary rounded-pill px-4">Add your first recipe</Link>
          )}
        </div>
      )}

      {/* Global Confirmation Component */}
      <ConfirmDialog
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancel}
        onClose={confirm.close}
      />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { RecipeGrid } from '../components/recipe/RecipeGrid.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { CategoryFilter } from '../components/ui/CategoryFilter.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { toast } from 'react-toastify';

export default function Recipes() {
  const { recipes, deleteRecipe } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, recipeId: null });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  const handleDelete = (recipeId) => {
    setDeleteModal({ isOpen: true, recipeId });
  };

  const confirmDelete = () => {
    deleteRecipe(deleteModal.recipeId);
    setDeleteModal({ isOpen: false, recipeId: null });
    toast.success('Recipe deleted successfully!');
  };

  const handleEdit = (recipe) => {
    navigate(`/editRecipe/${recipe.id}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Recipes</h1>
        <Button variant="primary" onClick={() => navigate('/addRecipe')}>
          Add New Recipe
        </Button>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <RecipeGrid
        recipes={recipes}
        searchTerm={debouncedSearchTerm}
        selectedCategory={selectedCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, recipeId: null })}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, recipeId: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}*/