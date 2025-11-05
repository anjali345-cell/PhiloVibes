"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Background from "../../components/Background";

export default function HomePage() {
  const [quote, setQuote] = useState({ text: "", author: "" });

  const fetchQuote = async () => {
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const data = await res.json();
      const q = Array.isArray(data) ? data[0] : data;
      setQuote({ text: q.q, author: q.a });
    } catch {
      setQuote({
        text: "The unexamined life is not worth living.",
        author: "Socrates",
      });
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center text-white">
      <Background />
      <div className="relative z-10 px-6 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-serif mb-8"
        >
          PhiloVibes
        </motion.h1>

        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-2xl sm:text-3xl italic mb-4">“{quote.text}”</p>
          <p className="text-lg opacity-80">— {quote.author}</p>
        </motion.div>

        <motion.button
          onClick={fetchQuote}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-2 rounded-full bg-white/10 border border-white/30 text-sm sm:text-base backdrop-blur-md shadow-md hover:bg-white/20 transition"
        >
          New Quote
        </motion.button>

        <footer className="mt-16 text-xs text-gray-300">
          crafted with ☕ & philosophy
        </footer>
      </div>
    </main>
  );
}
