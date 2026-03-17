import React, { memo, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecipes } from '../../hooks/useRecipes.js';
import { toast } from 'react-toastify';

const CAT_COLORS = {
  breakfast: '#6FAE48', lunch: '#E8A020', dinner: '#C0622A',
  dessert: '#7B5EA7', snack: '#3A8DC5', snacks: '#3A8DC5',
};

function areEqual(prev, next) {
  return (
    prev.recipe.id        === next.recipe.id &&
    prev.recipe.pic       === next.recipe.pic &&
    prev.recipe.name      === next.recipe.name &&
    prev.recipe.favourite === next.recipe.favourite &&
    prev.recipe.cookTime  === next.recipe.cookTime &&
    prev.index            === next.index
  );
}

const RecipeCard = memo(({ recipe, onDelete, index = 0 }) => {
  const navigate = useNavigate();
  const { updateRecipe } = useRecipes();

  const [menuOpen, setMenuOpen]   = useState(false);
  const [favourite, setFavourite] = useState(recipe.favourite || false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const toggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !favourite;
    setFavourite(next);
    updateRecipe(recipe.id, { ...recipe, favourite: next });
    if (next) {
      toast.success('Recipe added to favourites');
    } else {
      toast.success('Recipe removed from favourites');
    }
  };

  const dotColor = CAT_COLORS[recipe.category?.toLowerCase()] || '#C0622A';

  return (
    <motion.div
      className="rc-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Image */}
      <Link to={`/recipeDetails/${recipe.id}`} className="rc-img-link">
        <div className="rc-img-wrap">
          <img
            src={recipe.pic || '/images/recipe1.jpg'}
            alt={recipe.name}
            loading="lazy"
            className="rc-img"
          />
        </div>

        {/* Category badge */}
        <span className="rc-cat-badge">{recipe.category}</span>

        {/* Favourite */}
        <button
          className={`rc-fav-btn ${favourite ? 'active' : ''}`}
          onClick={toggleFavourite}
          title={favourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {favourite ? '♥' : '♡'}
        </button>
      </Link>

      {/* Body */}
      <div className="rc-body">
        <Link to={`/recipeDetails/${recipe.id}`} className="rc-title-link">
          <h3 className="rc-title">{recipe.name}</h3>
        </Link>
        <p className="rc-meta">
          {recipe.servings ? `${recipe.servings} servings` : ''}
          {recipe.servings && recipe.cook ? ' · ' : ''}
          {recipe.cook || ''}
        </p>

        {/* Footer */}
        <div className="rc-footer">
          <div className="rc-tag-row">
            <span className="rc-dot" style={{ background: dotColor }} />
            <span className="rc-tag">{recipe.category}</span>
          </div>
          <span className="rc-time">{recipe.cook || ''}</span>

          {/* Three-dot menu */}
          <div className="rc-menu-wrap" ref={menuRef}>
            <button
              className="rc-menu-btn"
              onClick={(e) => { e.preventDefault(); setMenuOpen(v => !v); }}
              title="More options"
            >
              ⋯
            </button>
            {menuOpen && (
              <div className="rc-dropdown">
                <Link
                  to={`/recipeDetails/${recipe.id}`}
                  className="rc-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  View
                </Link>
                <button
                  className="rc-dropdown-item"
                  onClick={() => { setMenuOpen(false); navigate(`/editRecipe/${recipe.id}`); }}
                >
                  Edit
                </button>
                <button
                  className="rc-dropdown-item danger"
                  onClick={() => { setMenuOpen(false); onDelete(recipe.id); }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .rc-card {
          border: 1px solid rgba(150, 80, 30, 0.52);
          border-radius: var(--radius-card);
          overflow: visible;
          background: transparent;
          box-shadow: var(--shadow-card);
          transition: box-shadow var(--transition-base);
          position: relative;
        }
        .rc-card:hover { box-shadow: var(--shadow-hover); }

        /* Image */
        .rc-img-link {
          display: block;
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-card) var(--radius-card) 0 0;
          text-decoration: none;
        }
        .rc-img-wrap {
          height: 200px;
          overflow: hidden;
        }
        .rc-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .rc-card:hover .rc-img { transform: scale(1.04); }

        /* Category badge */
        .rc-cat-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(20, 8, 0, 0.48);
          color: #fff;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: var(--radius-pill);
          pointer-events: none;
        }

        /* Favourite */
        .rc-fav-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.85);
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-muted);
          transition: background var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
          backdrop-filter: blur(4px);
        }
        .rc-fav-btn:hover { background: #fff; transform: scale(1.1); }
        .rc-fav-btn.active { color: var(--brand); }

        /* Body */
        .rc-body { padding: 12px 14px 14px; }
        .rc-title-link { text-decoration: none; color: inherit; }
        .rc-title {
          font-family: var(--font-display);
          font-size: 0.9375rem;
          font-weight: 500;
          margin-bottom: 4px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rc-meta {
          font-size: 0.75rem;
          color: var(--brand-muted);
          margin-bottom: 10px;
          min-height: 16px;
        }

        /* Footer */
        .rc-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 10px;
          border-top: 0.5px solid rgba(150, 80, 30, 0.1);
        }
        .rc-tag-row {
          display: flex;
          align-items: center;
          gap: 5px;
          flex: 1;
        }
        .rc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .rc-tag {
          font-size: 0.6875rem;
          background: var(--brand-light);
          color: white;
          border-radius: 4px;
          padding: 2px 8px;
          text-transform: capitalize;
          white-space: nowrap;
        }
        .rc-time {
          font-size: 0.6875rem;
          color: var(--brand-muted);
          white-space: nowrap;
        }

        /* Three-dot menu */
        .rc-menu-wrap { position: relative; }
        .rc-menu-btn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          background: transparent;
          font-size: 1rem;
          line-height: 1;
          color: var(--brand-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity var(--transition-fast), background var(--transition-fast);
          letter-spacing: -1px;
        }
        .rc-menu-btn:hover { background: var(--brand-light); color: var(--brand); }

        .rc-dropdown {
          position: absolute;
          bottom: calc(100% + 6px);
          right: 120%;
          background: var(--surface-card);
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-hover);
          min-width: 110px;
          overflow: hidden;
          z-index: 5 !important;
        }
        .rc-dropdown-item {
          display: block;
          width: 100%;
          padding: 9px 14px;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.06);
          color: white;
          text-decoration: none;
          transition: background var(--transition-fast);
          cursor: pointer;
        }
        .rc-dropdown-item:last-child { border-bottom: none; }
        .rc-dropdown-item:hover { background: var(--brand-light); }
        .rc-dropdown-item.danger { color: #c0392b; }
        .rc-dropdown-item.danger:hover { background: #fff0ee; }
      `}</style>
    </motion.div>
  );
}, areEqual);

RecipeCard.displayName = 'RecipeCard';
export { RecipeCard };


/*import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button.jsx';
import { motion } from 'framer-motion';

const RecipeCard = memo(({ recipe, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="recipe-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="recipe-image-container"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={recipe.pic || "/images/recipe1.jpg"}
          alt={recipe.name}
          className="recipe-image"
          loading="lazy"
        />

        {/* Quick Actions Overlay *
        <motion.div
          className="quick-actions-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="quick-actions">
            <Link to={`/recipeDetails/${recipe.id}`}>
              <motion.button
                className="quick-action-btn view-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faEye} />
                <span>View</span>
              </motion.button>
            </Link>
            <motion.button
              className="quick-action-btn edit-btn"
              onClick={() => onEdit(recipe)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit</span>
            </motion.button>
            <motion.button
              className="quick-action-btn delete-btn"
              onClick={() => onDelete(recipe.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>Delete</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="recipe-card-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="recipe-card-title">{recipe.name}</h3>
        <p className="recipe-card-description">
          {recipe.instructions.slice(0, 2).join(' ')}...
        </p>
        <div className="recipe-card-meta">
          <span className="recipe-card-category">{recipe.category}</span>
          <span className="recipe-card-time">
            <FontAwesomeIcon icon={faEdit} />
            {recipe.instructions.length} steps
          </span>
        </div>

        {/* Desktop Actions (hidden on mobile, shown in overlay) *
        <div className="d-flex justify-content-between align-items-center mt-3 d-none d-md-flex">
          <Link to={`/recipeDetails/${recipe.id}`}>
            <Button variant="primary" size="small">
              View Recipe
            </Button>
          </Link>
          <div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => onEdit(recipe)}
              className="me-1"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => onDelete(recipe.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

RecipeCard.displayName = 'RecipeCard';

export { RecipeCard };*/