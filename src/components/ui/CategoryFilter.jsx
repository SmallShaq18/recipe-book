import React from 'react';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'dessert', label: 'Dessert' }
];

export function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category.value}
          className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}