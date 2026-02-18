export interface SearchBook {
  key: string;
  title: string;
  author: string;
  year: string | number;
  cover: string | null;
}

interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface OpenLibrarySearchResponse {
  docs: OpenLibraryDoc[];
}

export async function getBooks(query: string = "philosophy"): Promise<SearchBook[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data: OpenLibrarySearchResponse = await res.json();

  return data.docs.map((book) => ({
    key: book.key,
    title: book.title,
    author: book.author_name && book.author_name.length > 0 ? book.author_name[0] : "Unknown Author",
    year: book.first_publish_year ?? "N/A",
    cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
  }));
}
