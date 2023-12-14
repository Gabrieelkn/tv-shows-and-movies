"use client";
import { createContext, useContext, useState } from "react";

const ShowsContext = createContext();

export function ShowsProvider({ children }) {
  const [shows, setShows] = useState([]);
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState("");

  return (
    <ShowsContext.Provider
      value={{
        shows,
        setShows,
        query,
        setQuery,
        history,
        setHistory,
      }}
    >
      {children}
    </ShowsContext.Provider>
  );
}

export const useShows = () => {
  return useContext(ShowsContext);
};
