"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ShowsContext = createContext();

export function ShowsProvider({ children }) {
  const [shows, setShows] = useState(
    (typeof localStorage !== "undefined" &&
      JSON.parse(localStorage.getItem("shows"))) ||
      []
  );
  const [history, setHistory] = useState(
    (typeof localStorage !== "undefined" &&
      JSON.parse(localStorage.getItem("history"))) ||
      []
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("shows", JSON.stringify(shows));
  }, [shows]);

  return (
    <ShowsContext.Provider
      value={{ shows, setShows, query, setQuery, history, setHistory }}
    >
      {children}
    </ShowsContext.Provider>
  );
}

export const useShows = () => {
  return useContext(ShowsContext);
};
