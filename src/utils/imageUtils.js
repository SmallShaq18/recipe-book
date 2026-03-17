// ── Image compression ─────────────────────────────────────────────────────

export function compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    const img    = new Image();
    const url    = URL.createObjectURL(file);

    img.onload = () => {
      // Revoke the object URL as soon as the image loads to free memory
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
      } else {
        if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight; }
      }

      canvas.width  = Math.round(width);
      canvas.height = Math.round(height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Image compression failed')),
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

// ── Validation ────────────────────────────────────────────────────────────

export function validateImageFile(file, maxSizeKB = 500) {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image (JPG, PNG, WebP, etc.)');
  }
  if (file.size > maxSizeKB * 1024) {
    throw new Error(`Image must be smaller than ${maxSizeKB} KB`);
  }
  return true;
}

// ── Base64 conversion ─────────────────────────────────────────────────────

export function fileToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(blob);
  });
}

// ── Main entry point (used by ImageUploader) ──────────────────────────────

export async function processImageFile(file) {
  validateImageFile(file);             // throws if invalid
  const compressed = await compressImage(file);
  return await fileToBase64(compressed);
}