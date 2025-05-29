import React, { useState, useRef } from "react";

const Autocomplete = ({ label, value, onChange, options = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const input = e.target.value;
    onChange({ target: { value: input } });
    setError("");

    const matches = options.filter((option) =>
      option.stationName.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(matches);
    setShowSuggestions(input.length > 0);
  };

  const handleSelect = (stationName) => {
    onChange({ target: { value: stationName } });
    setShowSuggestions(false);
    setError("");
  };

  const handleBlur = () => {
    setTimeout(() => {
      const isValid = options.some(
        (option) => option.stationName.toLowerCase() === value.toLowerCase()
      );
      if (!isValid && value !== "") {
        setFromError("");
        setToError("");

        setError("Ga không tồn tại");
        // Không xóa giá trị input, giữ nguyên value thông qua onChange
      } else {
        setError("");
      }
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
      )}
      <input
        type="text"
        value={value}
        ref={inputRef}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(value.length > 0)}
        onBlur={handleBlur}
        style={{
          width: "100%",
          padding: "8px",
          border: `1px solid ${error ? "#ff0000" : "#ccc"}`,
          borderRadius: "4px",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </div>
      )}
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
              key={option.stationId}
              onMouseDown={() => handleSelect(option.stationName)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: "white",
                ":hover": { backgroundColor: "#f1f1f1" },
              }}
            >
              {option.stationName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

