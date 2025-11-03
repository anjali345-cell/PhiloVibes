"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-28">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="font-playfair text-4xl md:text-6xl mb-6"
      >
        “Be kind, for everyone you meet is fighting a hard battle.”
      </motion.h1>
      <p className="text-gray-600 font-inter text-sm md:text-base mb-10">
        — Plato
      </p>
      <motion.a
        href="/explore"
        whileHover={{ scale: 1.05 }}
        className="px-6 py-3 rounded-full bg-[#A67C52] text-white font-medium shadow-md hover:shadow-lg transition"
      >
        Explore Quotes
      </motion.a>
    </section>
  );
}
