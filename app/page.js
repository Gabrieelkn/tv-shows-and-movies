import NowPlayingMovies from "@/components/NowPlayingMovies/NowPlayingMovies";
import styles from "./page.module.css";

export default async function Home() {
  return (
    <div className={styles.home}>
      <NowPlayingMovies />
    </div>
  );
}
