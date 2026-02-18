import QuoteCard from "../../../components/QuoteCard";

interface ApiQuote {
  q: string;
  a: string;
}

interface ExploreQuote {
  text: string;
  author: string;
  topic: string;
}

async function fetchPhilosophyQuotes(): Promise<ExploreQuote[]> {
  const res = await fetch("https://zenquotes.io/api/quotes", { cache: "no-store" });

  if (!res.ok) {
    return [
      {
        text: "The unexamined life is not worth living.",
        author: "Socrates",
        topic: "Life",
      },
      {
        text: "Knowing yourself is the beginning of all wisdom.",
        author: "Aristotle",
        topic: "Wisdom",
      },
      {
        text: "Without music, life would be a mistake.",
        author: "Friedrich Nietzsche",
        topic: "Art",
      },
      {
        text: "He who thinks great thoughts, often makes great errors.",
        author: "Martin Heidegger",
        topic: "Philosophy",
      },
    ];
  }

  const data: ApiQuote[] = await res.json();

  return data.slice(0, 18).map((q) => ({
    text: q.q,
    author: q.a,
    topic: "Philosophy",
  }));
}

export default async function ExplorePage() {
  const quotes = await fetchPhilosophyQuotes();

  return (
    <section className="py-16">
      <h1 className="font-serif text-4xl text-center mb-10 text-[#A67C52]">
        Explore Quotes
      </h1>

      <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {quotes.map((quote, i) => (
          <QuoteCard key={i} {...quote} />
        ))}
      </div>
    </section>
  );
}
