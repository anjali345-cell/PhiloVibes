export async function getBooks(query: string = "philosophy") {
  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
  );

  if (!res.ok) throw new Error("Failed to fetch books");

  const data = await res.json();

  return data.docs.map((book: any) => ({
    key: book.key,
    title: book.title,
    author: book.author_name ? book.author_name[0] : "Unknown Author",
    year: book.first_publish_year || "N/A",
    cover: book.cover_i
      ? `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&limit=1&cover_i=${book.cover_i}-M.jpg`
      : null,
  }));
}
