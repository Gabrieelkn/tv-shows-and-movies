"use client";
import styles from "./result.module.css";
import { useShows } from "@/context/MovieProvider";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Loading from "../../../components/loading";

export default function Show({ params }) {
  const { shows } = useShows();
  const [streaming, setStreaming] = useState(null);
  const [details, setDetails] = useState(null);
  const [showSeasons, setShowSeasons] = useState(false);
  const [cast, setCast] = useState(null);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const rolesToShow = showAllRoles
    ? cast?.cast.map((actor) => actor)
    : cast?.cast.map((actor) => actor).slice(0, 7);
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = params.query;
  const path = usePathname();
  const seasonsRef = useRef();

  //fetch user country code
  useEffect(() => {
    const logUserCountry = async () => {
      try {
        const response = await fetch("https://geolocation-db.com/json/");
        const data = await response.json();

        if (data.country_code) {
          setCountry(data.country_code);
        } else {
          console.error("Unable to fetch user country code");
        }
      } catch (error) {
        console.error("Error fetching user country code:", error);
      }
    };

    logUserCountry();
  }, [streaming]);

  //fetch available streaming platforms based on country, fetch details, fetch cast
  useEffect(() => {
    if (
      path.includes("result") &&
      country &&
      country.length > 0 &&
      shows.length > 0
    ) {
      const show = shows.find((a) => a.id == id);
      const media_type = show.media_type ? show.media_type : "movie";
      if (show) {
        async function fetchData() {
          try {
            const streamingRes = await fetch(
              `/api/getStreamingPlatform?type=${
                show.media_type ? show.media_type : "movie"
              }&&query=${id}}`
            );
            const streamingData = await streamingRes.json();
            if (streamingData) {
              const streamingResult = streamingData.data.results[country];
              setStreaming(streamingResult.flatrate);
            } else {
              throw new Error();
            }
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        }
        async function fetchDetails() {
          try {
            const detailsRes = await fetch(
              `/api/getDetails?query=${id}&&type=${media_type}`
            );
            const detailsData = await detailsRes.json();
            if (detailsData) {
              setDetails(detailsData.data);
            } else {
              throw new Error();
            }
          } catch (error) {
            setLoading(false);
            throw new Error();
          }
        }
        async function fetchCast() {
          try {
            const castRes = await fetch(
              `/api/getCast?query=${id}&&type=${media_type}&&credits=${
                media_type === "movie" ? "credits" : "aggregate_credits"
              }`
            );
            const castData = await castRes.json();
            if (castData) {
              setCast(castData.data);
            } else {
              throw new Error();
            }
          } catch (error) {
            setLoading(false);
            throw new Error();
          }
        }
        fetchData();
        fetchDetails();
        fetchCast();
        setLoading(false);
      }
    }
  }, [country, id, path, shows]);

  //close seasons modal when click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (seasonsRef.current && !seasonsRef.current.contains(event.target)) {
        setShowSeasons(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {shows &&
            shows
              .filter((a) => a.id == id)
              .map((show) => {
                return (
                  <div className={styles.show} key={show.id}>
                    <div className={styles.banner}>
                      <Image
                        className={styles.background}
                        src={`https://image.tmdb.org/t/p/w500/${show.backdrop_path}`}
                        alt="path"
                        width={1500}
                        height={1500}
                      />
                      <Image
                        className={styles.portret}
                        src={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                        alt="path"
                        width={500}
                        height={500}
                      />
                    </div>
                    <h1>
                      {show.name ? show.name : show.title} ({" "}
                      {new Date(
                        `${
                          show.first_air_date
                            ? show.first_air_date
                            : show.release_date
                        }`
                      ).toLocaleDateString("en-UK", { year: "numeric" })}
                      )
                    </h1>
                    {streaming && <StreamingProvider streaming={streaming} />}
                    {details && show.media_type == "tv" ? (
                      <>
                        <p>
                          Number of seasons: {details.number_of_seasons} -{" "}
                          {details.number_of_episodes} episodes
                        </p>
                        <button
                          className={styles.seeSeasonsButton}
                          onClick={() => setShowSeasons(true)}
                        >
                          See seasons
                        </button>
                      </>
                    ) : null}
                    {showSeasons && (
                      <Seasons
                        details={details}
                        setShowSeasons={setShowSeasons}
                        seasonsRef={seasonsRef}
                      />
                    )}
                    <p>{show.overview}</p>
                    <Cast
                      cast={cast}
                      rolesToShow={rolesToShow}
                      showAllRoles={showAllRoles}
                      setShowAllRoles={setShowAllRoles}
                    />
                  </div>
                );
              })}
        </div>
      )}
    </>
  );
}

function Seasons({ details, setShowSeasons, seasonsRef }) {
  return (
    <div ref={seasonsRef} className={styles.showSeasons}>
      <button
        className={styles.goBackButton}
        onClick={() => setShowSeasons(false)}
      >
        Go back
      </button>
      <div className={styles.seasonsWrapper}>
        {details.seasons.map((s) => {
          return (
            <div className={styles.season} key={s.id}>
              <Image
                className={styles.seasonPoster}
                src={`https://image.tmdb.org/t/p/w500/${s.poster_path}`}
                alt="poster"
                width={150}
                height={350}
              />
              <div className={styles.details}>
                <p>
                  {s.name} - {s.episode_count} episodes
                </p>
                <p>{s.air_date}</p>
                <p>{s.overview}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StreamingProvider({ streaming }) {
  return (
    <div className={styles.streaming}>
      <p>Watch now on:</p>
      {streaming.map((s) => {
        return (
          <Image
            key={s.provider_id}
            src={`https://image.tmdb.org/t/p/w500/${s.logo_path}`}
            alt="logo"
            width={100}
            height={100}
          />
        );
      })}
    </div>
  );
}

function Cast({ cast, rolesToShow, showAllRoles, setShowAllRoles }) {
  return (
    <>
      <h2 className={styles.castHeader}>Cast:</h2>
      <div className={styles.cast}>
        {rolesToShow &&
          cast &&
          rolesToShow.map((actor) => {
            return (
              <div className={styles.actor} key={actor.id}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                  alt="profile"
                  width={400}
                  height={400}
                />
                <b>{actor.name}</b>
                {actor && actor.roles ? (
                  actor.roles.map((role) => (
                    <div key={role.credit_id}>
                      <p>{role.character}</p>
                      <p className={styles.actorEpisodes}>
                        {role.episode_count} episodes
                      </p>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>{actor.character}</p>
                  </div>
                )}
              </div>
            );
          })}
        <div className={styles.buttonWrapper}>
          <button
            onClick={() => setShowAllRoles(!showAllRoles)}
            className={styles.showAllCastButton}
          >
            {showAllRoles ? "See less" : "See more"}
          </button>
        </div>
      </div>
    </>
  );
}
