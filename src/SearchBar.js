import React, { useState } from 'react';
import './App.css';


const SearchBar = ({ onSearch, disabledSearch }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    setSymbol(symbol.trim().toUpperCase());
    e.preventDefault();
    if (symbol.length > 0 && symbol.length <= 5) {
      onSearch(symbol);  // Only submit if the input is valid
    }
    setSymbol('');
  };

  const isDisabled = disabledSearch || symbol.length === 0 || symbol.length > 5;  // Disable conditions

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter Stock Symbol"
        size={30}
        disabled={disabledSearch}
      />
      <button type='submit' className='cool-button' disabled={isDisabled}>Get Stock Data</button>
    </form>
  );
};

export default SearchBar;