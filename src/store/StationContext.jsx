import React, { createContext, useState, useEffect } from "react";

const StationContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}stations`);
      const data = await response.json();
      setStations(data.result || []);
    } catch (error) {
      console.error("Error fetching stations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <StationContext.Provider value={{ stations, loading }}>
      {children}
    </StationContext.Provider>
  );
};

export default StationContext;
