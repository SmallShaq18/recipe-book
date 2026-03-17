import React from 'react';

export function Card({ children, className = '', onClick }) {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h5 className={`card-title ${className}`}>
      {children}
    </h5>
  );
}

export function CardText({ children, className = '' }) {
  return (
    <p className={`card-text ${className}`}>
      {children}
    </p>
  );
}