"use client";
import { useShows } from "@/context/MovieProvider";
export default function Home() {
  const { history } = useShows();
  return (
    <div>
      <h1>Search for a movie or a tv show</h1>
      <p>Your search history:</p>
      <div>
        {history.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
}
