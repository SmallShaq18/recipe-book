import React from 'react';
import { Link } from 'react-router-dom';
export default function NoPage() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Page not found</h2>
      <Link to="/" style={{ color: 'var(--brand)' }}>← Go home</Link>
    </div>
  );
}