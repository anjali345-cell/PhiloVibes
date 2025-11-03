import Quote from "../src/app/model/Quote";
import { connectToDatabase } from "./db";

// Fetch latest quotes
export async function getQuotes(limit = 20) {
  await connectToDatabase();
  const quotes = await Quote.find().sort({ createdAt: -1 }).limit(limit);
  return quotes;
}

// Add a new quote
export async function addQuote(text: string, author?: string) {
  await connectToDatabase();
  const newQuote = await Quote.create({
    text,
    author: author || "Unknown",
  });
  return newQuote;
}
