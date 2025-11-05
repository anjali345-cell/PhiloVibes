// src/lib/getQuote.ts
export async function getQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      cache: "no-store",
      // add this if you're on Node 18+ to prevent SSL issues
      // agent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });
    if (!res.ok) throw new Error("Failed to fetch quote");

    const data = await res.json();
    const quoteData = Array.isArray(data) ? data[0] : data;

    return {
      text: quoteData.q || "The unexamined life is not worth living.",
      author: quoteData.a || "Socrates",
    };
  } catch (error) {
    console.error("Error fetching quote:", error);
    // fallback quote
    return {
      text: "The unexamined life is not worth living.",
      author: "Socrates",
    };
  }
}
