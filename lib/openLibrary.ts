export async function fetchBooksByAuthor(author: string) {
  const res = await fetch(`https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`);
  const data = await res.json();
  return data.docs.slice(0, 5).map((book: any) => ({
    title: book.title,
    year: book.first_publish_year,
    key: book.key,
  }));
}
