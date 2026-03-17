import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

/* ─── ScrollToTop ─────────────────────────────────────────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* ─── Layout ──────────────────────────────────────────────────────────────── */
export default function Layout({ toggleDarkMode, darkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div>
      <ScrollToTop />

      <header className="rb-header">
        {/* Wordmark */}
        <Link to="/" className="rb-wordmark">
          Bite<span className="">Book</span>
        </Link>

        {/* Desktop nav */}
        <nav className="rb-nav-desktop">
          <Link
            to="/recipeList"
            className={`  ${darkMode ? 'text-white' : 'text-black'} rb-nav-link ${location.pathname.startsWith('/recipes') || location.pathname.startsWith('/recipeList') ? 'active' : ''}`}
          >
            Recipes
          </Link>
          <Link
            to="/meal-planner"
            className={` ${darkMode ? 'text-white' : 'text-black'} rb-nav-link ${location.pathname.startsWith('/meal-planner') ? 'active' : ''}`}
          >
            Meal Planner
          </Link>
          <Link
            to="/favourites"
            className={`  ${darkMode ? 'text-white' : 'text-black'} rb-nav-link ${location.pathname.startsWith('/favourites')  ? 'active' : ''}`}
          >
            Favourites
          </Link>
        </nav>

        {/* Right actions */}
        <div className="rb-header-actions">
          <button
            onClick={toggleDarkMode}
            className={`rb-icon-btn ${darkMode ? 'text-white' : 'text-black'}`}
            aria-label="Toggle theme"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀︎' : '☽'}
          </button>
          <Link to="/addNewRecipe" className="rb-add-btn">
            Add Recipe
          </Link>
          {/* Mobile hamburger */}
          <button
            className="rb-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`rb-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`rb-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`rb-hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`rb-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/recipes" className="rb-mobile-link">Recipes</Link>
        <Link to="/meal-planner" className="rb-mobile-link">Meal Planner</Link>
        <Link to="/favourites" className="rb-mobile-link">Favourites</Link>
        <Link to="/addNewRecipe" className="rb-mobile-link rb-mobile-add">+ Add Recipe</Link>
      </div>

      <main>
        <Outlet />
      </main>

      <style>{`
        /* ── Header ──────────────────────────────────────────────────────── */
        .rb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 64px;
          
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.12);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }

        .rb-wordmark {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 500;
          color: inherit;
          letter-spacing: -0.01em;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .rb-wordmark span {
          color: var(--brand);
        }

        /* ── Desktop nav ─────────────────────────────────────────────────── */
        .rb-nav-desktop {
          display: flex;
          gap: 32px;
        }
        .rb-nav-link {
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--bs-body-color, #2c1a0e);
          text-decoration: none;
          opacity: 0.65;
          transition: opacity var(--transition-fast);
          position: relative;
          padding-bottom: 2px;
        }
        .rb-nav-link:hover,
        .rb-nav-link.active {
          opacity: 1;
        }
        .rb-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--brand);
          border-radius: 1px;
        }

        /* ── Header actions ──────────────────────────────────────────────── */
        .rb-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rb-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: background var(--transition-fast);
        }
        .rb-icon-btn:hover {
          background: var(--brand-light);
        }
        .rb-add-btn {
          background: var(--brand);
          color: #fff !important;
          padding: 7px 18px;
          border-radius: var(--radius-pill);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background var(--transition-fast), box-shadow var(--transition-fast);
          text-decoration: none;
          cursor: pointer;
        }
        .rb-add-btn:hover {
          background: var(--brand-hover);
          box-shadow: 0 3px 12px rgba(192, 98, 42, 0.3);
          
        }

        /* ── Hamburger ───────────────────────────────────────────────────── */
        .rb-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          padding: 4px;
          color: var(--brand);
          transition: background var(--transition-fast);
        }
        .rb-hamburger-line {
          display: block;
          width: 22px;
          height: 1.5px;
          background: currentColor;
          border-radius: 1px;
          transition: transform var(--transition-base), opacity var(--transition-fast);
        }
        .rb-hamburger-line.open:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .rb-hamburger-line.open:nth-child(2) { opacity: 0; }
        .rb-hamburger-line.open:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile menu ─────────────────────────────────────────────────── */
        .rb-mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.12);
          overflow: hidden;
          max-height: 0;
          transition: max-height var(--transition-base);
          z-index: 1000;
          position: fixed;
          width: 97%;
        }
        .rb-mobile-menu.open {
          max-height: 280px;
        }
        .rb-mobile-link {
          padding: 14px 32px;
          text-align: center;
          text-decoration: none;
          color: var(--brand);
          font-size: 0.9375rem;
          font-weight: 400;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.08);
          transition: background var(--transition-fast);
        }
        .rb-mobile-link:hover {
          background: var(--brand-light);
        }
        .rb-mobile-add {
          color: var(--brand);
          font-weight: 500;
        }

        /* ── Responsive ──────────────────────────────────────────────────── */
        @media (max-width: 640px) {
          .rb-header { padding: 0 20px; }
          .rb-nav-desktop { display: none; }
          .rb-hamburger { display: flex; }
          .rb-mobile-menu { display: flex; }
          .rb-add-btn { display: none; }
        }
      `}</style>
    </div>
  );
}
