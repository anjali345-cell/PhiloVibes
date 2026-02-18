interface OpenLibraryAuthorDoc {
  key: string;
  title: string;
  first_publish_year?: number;
}

interface OpenLibraryAuthorSearchResponse {
  docs: OpenLibraryAuthorDoc[];
}

export interface AuthorBook {
  title: string;
  year?: number;
  key: string;
}

export async function fetchBooksByAuthor(author: string): Promise<AuthorBook[]> {
  const res = await fetch(
    `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`,
  );
  const data: OpenLibraryAuthorSearchResponse = await res.json();

  return data.docs.slice(0, 5).map((book) => ({
    title: book.title,
    year: book.first_publish_year,
    key: book.key,
  }));
}
