'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Lightbulb, Compass } from 'lucide-react';

export default function PhiloVibesHome() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const slides = [
    {
      title: 'What is PhiloVibes?',
      description:
        'A serene digital space for philosophy beginners and readers to discover timeless wisdom, explore philosophical quotes, and engage with ideas that shape human understanding.',
      icon: '📚',
    },
    {
      title: 'Discover Ancient Wisdom',
      description:
        'Explore stoicism, existentialism, and Eastern philosophy. Read philosophy online in a calm, beautiful environment designed for deep thinking.',
      icon: '✨',
    },
    {
      title: 'Your Peaceful Reading Sanctuary',
      description:
        'Immerse yourself in philosophical quotes and books. No distractions, no clutter—just meaningful content in an aesthetically minimal space.',
      icon: '🕯️',
    },
  ];

  const categories = [
    {
      title: 'Stoicism',
      description:
        'Explore the timeless wisdom of Marcus Aurelius, Epictetus, and Seneca. Learn how stoicism books teach virtue, resilience, and inner peace.',
      link: '#stoicism',
      icon: '⚡',
    },
    {
      title: 'Existentialism',
      description:
        'Dive into existential philosophy with Camus, Sartre, and Kierkegaard. Understand freedom, meaning, and the beauty of absurdity.',
      link: '#existentialism',
      icon: '🌀',
    },
    {
      title: 'Eastern Philosophy',
      description:
        'Journey through Taoism, Buddhism, and Confucianism. Discover ancient Eastern wisdom for modern living.',
      link: '#eastern',
      icon: '☯️',
    },
    {
      title: 'Nihilism & Beyond',
      description:
        'Examine nihilism, absurdism, and post-modern philosophy. Question meaning, reality, and human existence.',
      link: '#nihilism',
      icon: '🌌',
    },
    {
      title: 'Deep Quotes',
      description:
        'Curated philosophical quotes from the greatest thinkers. Brief wisdom for profound contemplation and reflection.',
      link: '/playground',
      icon: '💭',
    },
    {
      title: 'Beginner\'s Guide',
      description:
        'New to philosophy? Start here. Philosophy for beginners explained clearly and beautifully.',
      link: './books',
      icon: '🌱',
    },
  ];

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900 opacity-40" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-3xl text-center">
            {/* Subtle glow effect */}
            <div
              className="absolute -inset-40 bg-gradient-to-r from-amber-950/20 via-transparent to-slate-900/20 rounded-full blur-3xl"
              style={{
                opacity: 0.5 + Math.sin(scrollY / 200) * 0.3,
              }}
              aria-hidden="true"
            />

            {/* Logo/Brand */}
            <div className="mb-6 inline-block">
              <h1 className="text-6xl sm:text-7xl font-serif font-light tracking-tight mb-2">
                PhiloVibes
              </h1>
              <div className="h-1 w-16 bg-gradient-to-r from-amber-700 to-amber-900 mx-auto" />
            </div>

            {/* Main SEO Heading */}
            <h2 className="text-3xl sm:text-5xl font-serif font-light leading-tight mb-6 text-slate-100">
              Read Philosophy Online <br />
              <span className="text-amber-300">in a Beautiful Way</span>
            </h2>

            {/* Subheading with SEO Keywords */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover philosophical quotes, stoicism books, existentialism, and deep wisdom.
              PhiloVibes is your sanctuary for philosophy beginners and readers seeking meaning.
              Explore timeless ideas in a calm, elegantly designed space.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="/books">
                <button className="group px-8 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-sm hover:bg-white/15 hover:border-white/50 transition duration-300 flex items-center justify-center gap-2 text-white font-medium">
                  Start Reading
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </Link>
              <Link href="/playground">
                <button className="px-8 py-3 bg-amber-900/30 border border-amber-700/50 rounded-lg backdrop-blur-sm hover:bg-amber-900/50 transition duration-300 text-amber-100 font-medium">
                  Explore Quotes
                </button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="mt-16 animate-pulse">
              <svg
                className="w-6 h-6 mx-auto text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* INTRODUCTION SLIDES SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif font-light mb-4 text-center">
              Welcome to PhiloVibes
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Explore philosophy in a new way
            </p>

            {/* Slides Container */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 pb-4 min-w-max px-2">
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-80 p-8 rounded-lg transition duration-500 ${activeSlide === idx
                      ? 'bg-white/10 border border-white/30 backdrop-blur-md shadow-lg'
                      : 'bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8'
                      }`}
                  >
                    <div className="text-4xl mb-4">{slide.icon}</div>
                    <h3 className="text-xl font-serif font-light mb-3">
                      {slide.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full transition duration-300 ${activeSlide === idx
                    ? 'w-8 bg-amber-700'
                    : 'w-2 bg-slate-600 hover:bg-slate-500'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED CATEGORIES SECTION */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-slate-950/30 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif font-light mb-4 text-center">
              Explore Philosophy
            </h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Discover different philosophical traditions and topics for every reader
            </p>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, idx) => (
                <a
                  key={idx}
                  href={category.link}
                  className="group relative p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition duration-300 overflow-hidden"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/0 to-amber-950/0 group-hover:from-amber-900/10 group-hover:to-amber-950/5 transition duration-300" />

                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{category.icon}</div>

                    <h3 className="text-xl font-serif font-light mb-3 group-hover:text-amber-300 transition">
                      {category.title}
                    </h3>

                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition leading-relaxed mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-2 text-amber-700 group-hover:text-amber-500 transition text-sm font-medium">
                      Explore
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-light mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of philosophy readers exploring wisdom, quotes, and ideas that
              matter. Find your favorite stoicism books, existential philosophy texts, or
              beginner-friendly philosophical content.
            </p>
            <Link href="/books">
              <button className="px-10 py-4 bg-amber-900/40 border border-amber-700/60 rounded-lg backdrop-blur-sm hover:bg-amber-900/60 hover:border-amber-700 transition duration-300 text-amber-100 font-medium flex items-center justify-center gap-2 mx-auto">
                <BookOpen className="w-5 h-5" />
                Start Exploring Now
              </button>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 border-t border-white/10 bg-gradient-to-r from-slate-950/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-serif font-light text-lg mb-4">PhiloVibes</h4>
                <p className="text-sm text-slate-400">
                  Read philosophy online beautifully. Your sanctuary for philosophical wisdom.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-300">Explore</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a href="/books" className="hover:text-amber-400 transition">
                      Philosophy Books
                    </a>
                  </li>
                  <li>
                    <a href="/explore" className="hover:text-amber-400 transition">
                      Philosophical Quotes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Stoicism
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-300">Learn</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Philosophy for Beginners
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Existentialism
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Eastern Philosophy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-slate-300">More</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a href="/about" className="hover:text-amber-400 transition">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-amber-400 transition">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="https://anjali-shrivastava-portfolio.netlify.app/" className="hover:text-amber-400 transition">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
              <p>&copy; 2024 PhiloVibes. Crafted with philosophy and care.</p>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <a href="#" className="hover:text-amber-400 transition">
                  Privacy
                </a>
                <a href="#" className="hover:text-amber-400 transition">
                  Terms
                </a>
                <a href="#" className="hover:text-amber-400 transition">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}