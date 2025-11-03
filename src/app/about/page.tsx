"use client";

import AnimatedWrapper from "../../../components/AnimatedWrapper";

export default function AboutPage() {
  return (
    <AnimatedWrapper>
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#F9F5EC] to-white">
        <h1 className="font-playfair text-4xl text-[#A67C52] mb-6">About Philophile</h1>
        <p className="max-w-2xl mx-auto text-gray-700 leading-relaxed">
          Philophile is a calm corner for those who love philosophy, books, and quiet reflection.
          Here, you can explore timeless wisdom, craft your own quotes, and rediscover the art of
          thinking deeply — all through a serene interface built with care.
        </p>
        <p className="mt-6 text-gray-500 text-sm">
          Built with Next.js, Tailwind CSS, TypeScript, and a bit of soul.
        </p>
      </section>
    </AnimatedWrapper>
  );
}
