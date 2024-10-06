// src/components/SearchBar.js
import React from 'react';
import './SearchBar.css'; // Create a CSS file for SearchBar styles

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search tasks..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
