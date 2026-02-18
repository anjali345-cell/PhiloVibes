import { NextRequest, NextResponse } from "next/server";
import { getBooks } from "../../../../lib/getBooks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "philosophy";

  try {
    const books = await getBooks(query);
    return NextResponse.json({ books });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}
