"use client";
import { motion } from "framer-motion";

interface QuoteCardProps {
  text: string;
  author: string;
  topic: string;
}

export default function QuoteCard({ text, author, topic }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid p-6 rounded-2xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition"
    >
      <p className="font-playfair text-lg mb-3 text-gray-800">“{text}”</p>
      <p className="text-sm text-gray-600">— {author}</p>
      <span className="inline-block mt-3 text-xs text-[#A67C52] font-medium">
        {topic}
      </span>
    </motion.div>
  );
}
