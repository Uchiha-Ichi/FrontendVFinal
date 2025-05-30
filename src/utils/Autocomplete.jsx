import React, { useState, useRef } from "react";

const Autocomplete = ({ label, value, onChange, options = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [inputValue, setInputValue] = useState(value?.name || "");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);

    const matches = options.filter((option) =>
      option.name.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(matches);
    setShowSuggestions(input.length > 0);
  };

  const handleSelect = (station) => {
    setInputValue(station.name);
    onChange(station);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const match = options.find(
        (option) => option.name.toLowerCase() === inputValue.toLowerCase()
      );
      if (match) {
        onChange(match);
      }
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
      )}
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(inputValue.length > 0)}
        onBlur={handleBlur}
        placeholder="Chọn ga"
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: "none",
            borderRadius: "0 0 4px 4px",
          }}
        >
          {filtered.map((option) => (
            <li
              key={option.id}
              onMouseDown={() => handleSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "white",
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
