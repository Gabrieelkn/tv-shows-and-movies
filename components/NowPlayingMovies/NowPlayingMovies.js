"use client";
import styles from "./NowPlayingMovies.module.css";
import Image from "next/image";
import Link from "next/link";
import Loading from "../loading";
import { useEffect, useState } from "react";
import { useShows } from "@/context/MovieProvider";

export default function NowPlayingMovies() {
  const { setShows } = useShows();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getNowPlayingMovies`);
        const data = await res.json();
        if (data) {
          setNowPlayingMovies(data.data.results);
          setShows(data.data.results);
          setLoading(false);
        } else {
          throw new Error();
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <h1 className={styles.header}>In theaters</h1>
          <div className={styles.wrapper}>
            {nowPlayingMovies.length > 0 ? (
              nowPlayingMovies.map((show) => {
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
        </>
      )}
    </>
  );
}
