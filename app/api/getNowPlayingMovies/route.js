import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?language=en-US&region=RO`,
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTgzMjU5NzJiN2I0YmYwMGY3Njk2MTRmOTE0YzEyNSIsInN1YiI6IjY1NmEwYTU3NzFmMDk1MDEzODAwYjczZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Sgc3ZQAxV_aoe-InbebutWJuMiM-pozUohIaTsvJZv4",
      },
    }
  );
  const data = await res.json();

  return NextResponse.json({ data });
}
