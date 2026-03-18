import React, { useEffect } from 'react';

export function Modal({ show, isOpen, onClose, children, title }) {
  const visible = show !== undefined ? show : isOpen;

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        {(title || onClose) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {onClose && (
              <button className="modal-close-btn" onClick={onClose} aria-label="Close">×</button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(26, 10, 0, 0.45);
          z-index: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .modal-panel {
          background: var(--surface-warm);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-pop);
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 0.5px solid rgba(150, 80, 30, 0.1);
          flex-shrink: 0;
        }
        .modal-title {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .modal-close-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          background: transparent;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-muted);
          flex-shrink: 0;
          transition: background var(--transition-fast), color var(--transition-fast);
          line-height: 1;
        }
        .modal-close-btn:hover { background: var(--brand-light); color: var(--brand); }
        .modal-body {
          padding: 20px 24px 24px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
