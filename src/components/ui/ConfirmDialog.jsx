import React from 'react';
import { Modal } from './Modal.jsx';

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel, onClose }) {
  const handleClose = onCancel || onClose;

  return (
    <Modal show={isOpen} onClose={handleClose}>
      <div className="cd-root">
        <div className="cd-icon">⚠</div>
        <h3 className="cd-heading">Are you sure?</h3>
        <p className="cd-message">{message}</p>
        <div className="cd-actions">
          <button className="cd-btn cd-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="cd-btn cd-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>

      <style>{`
        .cd-root {
          text-align: center;
          padding: 8px 0 4px;
        }
        .cd-icon {
          font-size: 2rem;
          margin-bottom: 12px;
          color: var(--brand);
          opacity: 0.7;
        }
        .cd-heading {
          font-family: var(--font-display);
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 10px;
          color: white;
        }
        .cd-message {
          font-size: 0.875rem;
          color: var(--brand-muted);
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }
        .cd-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .cd-btn {
          padding: 9px 24px;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .cd-cancel {
          background: transparent;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          color: var(--brand-muted);
        }
        .cd-cancel:hover { background: var(--brand-light); border-color: var(--brand); color: var(--brand); }
        .cd-confirm {
          background: #c0392b;
          border: none;
          color: #fff;
        }
        .cd-confirm:hover { background: #a93226; }
      `}</style>
    </Modal>
  );
}

/*import React from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';

export function ConfirmDialog({ isOpen, message, onConfirm, onCancel, onClose }) {
  return (
    <Modal show={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="mb-4">
          <div className="display-4 text-warning mb-3">⚠️</div>
          <h5 className="mb-3">Are you sure?</h5>
          <p className="text-muted mb-0">{message}</p>
        </div>

        <div className="d-flex gap-2 justify-content-center">
          <Button variant="secondary" onClick={onCancel || onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}*/