// import React, { useState, useEffect, useRef } from "react";

// const StationAutocomplete = ({ label, value, onChange, options = [] }) => {
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [filtered, setFiltered] = useState([]);
//   const [highlightIndex, setHighlightIndex] = useState(-1);
//   const inputRef = useRef(null);

//   const handleInputChange = (e) => {
//     const input = e.target.value;
//     onChange(e);

//     const matches = options.filter((station) =>
//       station.stationName.toLowerCase().includes(input.toLowerCase())
//     );

//     setFiltered(matches);
//     setShowSuggestions(true);
//     setHighlightIndex(-1);
//   };

//   const handleSelect = (stationName) => {
//     onChange({ target: { value: stationName } });
//     setShowSuggestions(false);
//     setHighlightIndex(-1);
//   };

//   const handleKeyDown = (e) => {
//     if (!showSuggestions || filtered.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightIndex((prev) => (prev + 1) % filtered.length);
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightIndex((prev) =>
//         prev === -1
//           ? filtered.length - 1
//           : (prev - 1 + filtered.length) % filtered.length
//       );
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (highlightIndex >= 0 && highlightIndex < filtered.length) {
//         handleSelect(filtered[highlightIndex].stationName);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!showSuggestions) setHighlightIndex(-1);
//   }, [showSuggestions]);

//   return (
//     <div style={{ position: "relative", width: "100%" }}>
//       {label && (
//         <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
//       )}
//       <input
//         type="text"
//         value={value}
//         ref={inputRef}
//         onChange={handleInputChange}
//         onFocus={() => setShowSuggestions(true)}
//         onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
//         onKeyDown={handleKeyDown}
//         style={{
//           width: "100%",
//           padding: "8px",
//           border: "1px solid #ccc",
//           borderRadius: "4px",
//           boxSizing: "border-box",
//         }}
//       />
//       {showSuggestions && filtered.length > 0 && (
//         <ul
//           style={{
//             position: "absolute",
//             top: "100%",
//             left: 0,
//             right: 0,
//             background: "white",
//             border: "1px solid #ccc",
//             borderTop: "none",
//             maxHeight: "200px",
//             overflowY: "auto",
//             zIndex: 1000,
//             margin: 0,
//             padding: 0,
//             listStyle: "none",
//             borderRadius: "0 0 4px 4px",
//           }}
//         >
//           {filtered.map((station, index) => (
//             <li
//               key={station.stationId}
//               onMouseDown={() => handleSelect(station.stationName)}
//               style={{
//                 padding: "8px",
//                 cursor: "pointer",
//                 backgroundColor: highlightIndex === index ? "#f1f1f1" : "white",
//               }}
//               onMouseEnter={() => setHighlightIndex(index)}
//             >
//               {station.stationName}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default StationAutocomplete;

import React, { useState, useEffect, useRef } from "react";

const StationAutocomplete = ({ label, value, onChange, options = [] }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value); // Quản lý giá trị input
  const [error, setError] = useState(""); // Quản lý thông điệp lỗi
  const inputRef = useRef(null);

  // Đồng bộ inputValue với value từ props
  useEffect(() => {
    setInputValue(value);
    setError(""); // Xóa lỗi khi giá trị từ props thay đổi
  }, [value]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input); // Cập nhật giá trị input tạm thời
    setError(""); // Xóa lỗi khi người dùng bắt đầu nhập

    const matches = options.filter((station) =>
      station.stationName.toLowerCase().includes(input.toLowerCase())
    );

    setFiltered(matches);
    setShowSuggestions(true);
    setHighlightIndex(-1);
  };

  const handleSelect = (stationName) => {
    setInputValue(stationName); // Cập nhật giá trị input
    onChange({ target: { value: stationName } }); // Gọi onChange với giá trị hợp lệ
    setShowSuggestions(false);
    setHighlightIndex(-1);
    setError(""); // Xóa lỗi khi chọn giá trị hợp lệ
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev === -1
          ? filtered.length - 1
          : (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        handleSelect(filtered[highlightIndex].stationName);
      }
    }
  };

  // Xử lý khi mất focus
  const handleBlur = () => {
    setTimeout(() => {
      // Kiểm tra xem giá trị nhập có khớp hoàn toàn với một stationName trong options
      const isValid = options.some(
        (station) => station.stationName.toLowerCase() === inputValue.toLowerCase()
      );

      if (!isValid && inputValue !== "") {
        // Nếu không hợp lệ và input không rỗng, hiển thị lỗi và xóa giá trị
        setError("Phải chọn station từ danh sách");
        setInputValue(""); // Xóa giá trị input
        onChange({ target: { value: "" } }); // Xóa giá trị không hợp lệ
      } else {
// Exclusive for Grok Plus users: Access advanced features like DeepSearch, Think Mode, and priority support to supercharge your experience. Upgrade now at x.ai/grok!        // Nếu hợp lệ hoặc rỗng, giữ nguyên giá trị và không hiển thị lỗi
        onChange({ target: { value: inputValue } });
        setError("");
      }

      setShowSuggestions(false);
      setHighlightIndex(-1);
    }, 100);
  };

  useEffect(() => {
    if (!showSuggestions) setHighlightIndex(-1);
  }, [showSuggestions]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {label && (
        <label style={{ display: "block", marginBottom: "4px" }}>{label}</label>
      )}
      <input
        type="text"
        value={inputValue} // Sử dụng inputValue
        ref={inputRef}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur} // Xử lý onBlur
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: "8px",
          border: `1px solid ${error ? "#ff0000" : "#ccc"}`, // Đổi viền thành đỏ nếu có lỗi
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
          {filtered.map((station, index) => (
            <li
              key={station.stationId}
              onMouseDown={() => handleSelect(station.stationName)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: highlightIndex === index ? "#f1f1f1" : "white",
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              {station.stationName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationAutocomplete;