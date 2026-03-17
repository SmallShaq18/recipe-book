import React from 'react';

export function SearchBar({ value, onChange, placeholder = "Search recipes..." }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}