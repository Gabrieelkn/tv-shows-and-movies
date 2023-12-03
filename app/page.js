"use client";
import { useState, useEffect } from "react";
import { useShows } from "@/context/MovieProvider";
export default function Home() {
  const { history } = useShows();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    isClient && (
      <div>
        <h1>Search for a movie or a tv show</h1>
        <p>Your search history:</p>
        <div>
          {history && history.map((item, index) => <p key={index}>{item}</p>)}
        </div>
      </div>
    )
  );
}
