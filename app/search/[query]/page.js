"use client";
import styles from "./Movies.module.css";
import Image from "next/image";
import Link from "next/link";
import { useShows } from "@/context/MovieProvider";
import Loading from "@/components/loading";

export default function Movies() {
  const { shows, loading } = useShows();

  return (
    <div className={styles.movies}>
      {loading ? (
        <Loading />
      ) : (
        shows &&
        shows.length > 0 &&
        shows
          .filter(
            (show) =>
              (show.media_type === "tv" ||
                (show.media_type === "movie" && show.name) ||
                show.title) &&
              show.poster_path
          )

          .map((show) => {
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
      )}
    </div>
  );
}
