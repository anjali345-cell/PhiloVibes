"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedWrapper from "../../../components/AnimatedWrapper";

export default function PlaygroundPage() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReflect = () => {
    if (!quote.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setQuote("");
    setAuthor("");
    setSubmitted(false);
  };

  return (
    <AnimatedWrapper>
      <section className="py-16 flex flex-col items-center justify-center text-center">
        <h1 className="font-playfair text-4xl text-[#A67C52] mb-6">Playground</h1>
        <p className="text-gray-600 mb-10">Write your own thought and reflect on it ✨</p>

        {!submitted ? (
          <div className="w-full max-w-md space-y-4">
            <input
              type="text"
              placeholder="Your quote..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#A67C52]"
            />
            <input
              type="text"
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#A67C52]"
            />
            <button
              onClick={handleReflect}
              className="mt-2 bg-[#A67C52] hover:bg-[#8B6A46] text-white px-6 py-2 rounded-md transition-colors"
            >
              Reflect
            </button>
          </div>
        ) : (
          <motion.div
            key={quote}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-10 p-6 rounded-2xl bg-[#F9F5EC] shadow-sm border border-gray-200 w-full max-w-lg"
          >
            <p className="font-playfair text-2xl text-gray-800 mb-3">“{quote}”</p>
            {author && <p className="text-sm text-gray-600">— {author}</p>}
            <p className="text-gray-500 text-sm mt-6">
              A moment of thought is a spark of your own philosophy.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 text-sm text-[#A67C52] underline hover:text-[#8B6A46] transition-colors"
            >
              Write another
            </button>
          </motion.div>
        )}
      </section>
    </AnimatedWrapper>
  );
}
