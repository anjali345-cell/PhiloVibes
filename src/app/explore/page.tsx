"use client";

import { useState } from "react";
import FilterBar from "../../../components/FilterBar";
import QuoteCard from "../../../components/QuoteCard";

const sampleQuotes = [
  { text: "The unexamined life is not worth living.", author: "Socrates", topic: "Life" },
  { text: "He who thinks great thoughts, often makes great errors.", author: "Martin Heidegger", topic: "Philosophy" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche", topic: "Art" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle", topic: "Love" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", topic: "Wisdom" },
];

export default function ExplorePage() {
  const [filter, setFilter] = useState("All");

  const filteredQuotes =
    filter === "All" ? sampleQuotes : sampleQuotes.filter((q) => q.topic === filter);

  return (
    <section className="py-16">
      <h1 className="font-playfair text-4xl text-center mb-10 text-[#A67C52]">
        Explore Quotes
      </h1>

      <FilterBar
        topics={["All", "Life", "Philosophy", "Art", "Love", "Wisdom"]}
        active={filter}
        onSelect={setFilter}
      />

      <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredQuotes.map((quote, i) => (
          <QuoteCard key={i} {...quote} />
        ))}
      </div>
    </section>
  );
}
