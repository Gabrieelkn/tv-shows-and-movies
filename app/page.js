import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

async function getNowPlaying() {
  try {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=RO",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTgzMjU5NzJiN2I0YmYwMGY3Njk2MTRmOTE0YzEyNSIsInN1YiI6IjY1NmEwYTU3NzFmMDk1MDEzODAwYjczZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Sgc3ZQAxV_aoe-InbebutWJuMiM-pozUohIaTsvJZv4",
          accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch now-playing movies");
    }
    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export default async function Home() {
  const nowPlayingMovies = await getNowPlaying();
  return (
    <div className={styles.home}>
      <h1 className={styles.header}>In theaters</h1>
      {nowPlayingMovies.results.length > 0 ? (
        nowPlayingMovies.results.map((show) => {
          return (
            <Link
              href={`/result/${show.id}`}
              key={show.id}
              className={styles.movieBox}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                alt="poster"
                width={500}
                height={500}
              />
              <p>{show.name ? show.name : show.title}</p>
              {show.first_air_date ||
                (show.release_date && (
                  <i>
                    {new Date(
                      `${
                        show.first_air_date
                          ? show.first_air_date
                          : show.release_date
                      }`
                    ).toLocaleDateString("en-UK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </i>
                ))}
            </Link>
          );
        })
      ) : (
        <div>Search a movie or a tv show</div>
      )}
    </div>
  );
}
