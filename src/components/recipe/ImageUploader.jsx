import React, { useState, useRef } from 'react';
import { processImageFile } from '../../utils/imageUtils.js';
import { toast } from 'react-toastify';

export function ImageUploader({ image, onImageChange }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const processed = await processImageFile(file);
      onImageChange(processed);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="iu-root">
      <span className="iu-label">Recipe photo</span>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {image ? (
        <div className="iu-preview-wrap">
          <div className="iu-preview-img-wrap">
            <img src={image} alt="Recipe preview" className="iu-preview-img" />
          </div>
          <div className="iu-preview-actions">
            <button
              type="button"
              className="iu-btn iu-change"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing…' : 'Change photo'}
            </button>
            <button
              type="button"
              className="iu-btn iu-remove"
              onClick={() => onImageChange('')}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`iu-dropzone ${isProcessing ? 'loading' : ''}`}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <span className="iu-dropzone-icon">📷</span>
          <span className="iu-dropzone-label">
            {isProcessing ? 'Processing image…' : 'Click to add a photo'}
          </span>
          <span className="iu-dropzone-hint">Max 500 KB · JPG or PNG</span>
        </div>
      )}

      <style>{`
        .iu-root { margin-bottom: 4px; }
        .iu-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--brand-muted);
        }
        /* Preview */
        .iu-preview-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .iu-preview-img-wrap {
          width: 100px;
          height: 100px;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 0.5px solid rgba(150, 80, 30, 0.15);
          flex-shrink: 0;
        }
        .iu-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .iu-preview-actions { display: flex; flex-direction: column; gap: 8px; }
        .iu-btn {
          padding: 7px 16px;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .iu-change {
          background: transparent;
          border: 0.5px solid rgba(150, 80, 30, 0.2);
          color: var(--brand-muted);
        }
        .iu-change:hover:not(:disabled) {
          background: var(--brand-light);
          border-color: var(--brand);
          color: var(--brand);
        }
        .iu-change:disabled { opacity: 0.5; cursor: not-allowed; }
        .iu-remove {
          background: transparent;
          border: 0.5px solid rgba(180, 40, 30, 0.2);
          color: #c0392b;
          font-size: 0.8125rem;
        }
        .iu-remove:hover { background: #fff0ee; border-color: #c0392b; }

        /* Dropzone */
        .iu-dropzone {
          border: 1px dashed rgba(150, 80, 30, 0.2);
          border-radius: var(--radius-card);
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: border-color var(--transition-fast), background var(--transition-fast);
          background: var(--surface-warm);
        }
        .iu-dropzone:hover:not(.loading) {
          border-color: var(--brand);
          background: var(--brand-light);
        }
        .iu-dropzone.loading { cursor: default; opacity: 0.6; }
        .iu-dropzone-icon { font-size: 1.5rem; }
        .iu-dropzone-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--brand-muted);
        }
        .iu-dropzone-hint {
          font-size: 0.75rem;
          color: var(--brand-muted);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

/*import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui/Button.jsx';
import { processImageFile } from '../../utils/imageUtils.js';
import { toast } from 'react-toastify';

export function ImageUploader({ image, onImageChange }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const processedImage = await processImageFile(file);
      onImageChange(processedImage);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onImageChange('');
  };

  return (
    <div className="form-group">
      <label>Recipe Image</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {image ? (
        <div className="image-preview mb-3">
          <img
            src={image}
            alt="Recipe preview"
            className="img-fluid rounded"
            style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
          />
          <div className="d-flex gap-2 mt-2">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={triggerFileInput}
              disabled={isProcessing}
            >
              <FontAwesomeIcon icon={faUpload} className="me-1" />
              Change Image
            </Button>
            <Button
              type="button"
              variant="danger"
              size="small"
              onClick={removeImage}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="image-upload-placeholder border border-2 border-dashed rounded p-4 text-center cursor-pointer"
          onClick={triggerFileInput}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faImage} size="3x" className="text-muted mb-3" />
          <p className="text-muted mb-2">
            {isProcessing ? 'Processing image...' : 'Click to upload recipe image'}
          </p>
          <p className="text-muted small">Max size: 500KB. Images will be compressed automatically.</p>
          <Button
            type="button"
            variant="primary"
            size="small"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Choose Image'}
          </Button>
        </div>
      )}
    </div>
  );
}*/