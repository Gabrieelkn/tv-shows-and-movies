"use client";
import styles from "./SearchBar.module.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShows } from "@/context/MovieProvider";

export default function SearchBar() {
  const [error, setError] = useState(false);
  const { query, setQuery, shows, setShows, history, setHistory } = useShows();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (query && query.length > 0) {
      setError(false);
    }
  }, [query]);

  useEffect(() => {
    if (query.length > 0) {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/getShows?query=${query}`);
          const data = await res.json();
          if (data) {
            setShows(data.data.results);
          } else {
            throw new Error();
          }
        } catch (error) {}
      };
      fetchData();
    }
  }, [query, setShows]);

  const search = (e) => {
    e.preventDefault();
    if (query.length > 0) {
      setHistory((prevHistory) => [...prevHistory, query]);
      localStorage.setItem("history", JSON.stringify([...history, query]));
      localStorage.setItem("shows", JSON.stringify(shows));
      if (shows && shows.length > 0) {
        router.push(`/search/${query}`);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <>
      <form onSubmit={search} className={styles.searchBar}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button className={styles.searchButton}>Search</button>
        {error && <p className={styles.error}>Type movie or tv show name</p>}
        {!path.includes("search") && (
          <Suggestions shows={shows} query={query} setQuery={setQuery} />
        )}
      </form>
    </>
  );
}

function Suggestions({ shows, query }) {
  const suggestions = shows.filter(
    (s) => s.name && s.name.toLowerCase().includes(query.toLowerCase())
  );
  return shows && query.length > 0 ? (
    <div className={styles.suggestions}>
      {suggestions.map((show) => {
        return <p key={show.id}>{show.name}</p>;
      })}
    </div>
  ) : null;
}
