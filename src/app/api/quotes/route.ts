import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    const q = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      text: q.q,
      author: q.a,
    });
  } catch {
    return NextResponse.json(
      {
        text: "The unexamined life is not worth living.",
        author: "Socrates",
      },
      { status: 200 },
    );
  }
}
