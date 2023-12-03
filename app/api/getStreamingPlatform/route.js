import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("query");
  const type = searchParams.get("type");
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/watch/providers`,
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
