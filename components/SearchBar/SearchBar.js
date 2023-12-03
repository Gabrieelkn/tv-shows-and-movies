"use client";
import styles from "./SearchBar.module.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useShows } from "@/context/MovieProvider";

export default function SearchBar() {
  const [error, setError] = useState(false);
  const { query, setQuery, setShows, history, setHistory } = useShows();
  const router = useRouter();
  const path = usePathname();
  const regex = /^\/search\/\w+$/;

  useEffect(() => {
    if (query && query.length > 0) {
      setError(false);
    }
  }, [query]);

  const fetchData = async () => {
    if (query && query.length > 0) {
      setHistory((prevHistory) => [...prevHistory, query]);
      localStorage.setItem("history", JSON.stringify([...history, query]));
      try {
        const res = await fetch(`/api/getShows?query=${query}`);
        const data = await res.json();
        if (data) {
          setShows(data.data.results);
          router.push(`/search/${query}`);
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className={styles.searchBar}>
      <input
        value={query}
        required
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={fetchData} className={styles.searchButton}>
        Search
      </button>
      {error && <p className={styles.error}>Type movie or tv show name</p>}
    </div>
  );
}
