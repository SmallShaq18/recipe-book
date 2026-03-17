import React from 'react';

export function Button({ children, variant = 'primary', size = 'medium', onClick, disabled, type = 'button', className = '' }) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning'
  };

  const sizeClasses = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}