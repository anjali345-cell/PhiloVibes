"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getBooks, type SearchBook } from "../../../lib/getBooks";
import Image from "next/image";

export default function BooksPage() {
  const [query, setQuery] = useState("philosophy");
  const [books, setBooks] = useState<SearchBook[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (q: string) => {
    setLoading(true);
    try {
      const results = await getBooks(q);
      setBooks(results);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks("philosophy");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-serif text-amber-900 mb-6">
          Philosophy Books
        </h1>
        <form onSubmit={handleSubmit} className="flex justify-center mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books (e.g. Stoicism, Plato, Mind)..."
            className="w-full max-w-md border border-amber-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-600"
          />
          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-2 rounded-r-xl hover:bg-amber-700 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-gray-600">Loading books...</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <motion.div
                key={book.key}
                whileHover={{ scale: 1.05 }}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-amber-100 hover:shadow-lg transition"
              >
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                    width={300}
                    height={400}
                  />
                ) : (
                  <div className="w-full h-64 bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                    No Cover
                  </div>
                )}
                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold text-amber-900">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-500">{book.year}</p>

                  <Link
                    href={`/books/${book.key.replace("/works/", "")}`}
                    className="text-amber-700 hover:underline text-sm mt-2 inline-block"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
