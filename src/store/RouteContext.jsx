import React, { createContext, useReducer } from "react";

const initialState = {
  from: "",
  to: "",
  date: "",
};

const SET_FROM = "SET_FROM";
const SET_TO = "SET_TO";
const SET_DATE = "SET_DATE";

function routeReducer(state, action) {
  switch (action.type) {
    case SET_FROM:
      return {
        ...state,
        from: action.payload,
      };
    case SET_TO:
      return {
        ...state,
        to: action.payload,
      };
    case SET_DATE:
      return {
        ...state,
        date: action.payload,
      };
    default:
      return state;
  }
}

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(routeReducer, initialState);

  const handleSetFrom = (value) =>
    dispatch({ type: "SET_FROM", payload: value });
  const handleSetTo = (value) => dispatch({ type: "SET_TO", payload: value });

  const handleSetDate = (date) => {
    dispatch({ type: SET_DATE, payload: date });
  };

  return (
    <RouteContext.Provider
      value={{ state, handleSetFrom, handleSetTo, handleSetDate }}
    >
      {children}
    </RouteContext.Provider>
  );
};
