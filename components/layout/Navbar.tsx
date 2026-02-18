"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/books",      label: "Books",      glyph: "✦" },
  { href: "/explore",    label: "Explore",    glyph: "◈" },
  { href: "/playground", label: "Playground", glyph: "⊹" },
  { href: "/about",      label: "About",      glyph: "◎" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Serif+Display:ital@0;1&display=swap');

        .nav-logo      { font-family: 'DM Serif Display', Georgia, serif; }
        .nav-link-font { font-family: 'Cormorant Garamond', Georgia, serif; }

        .gold-shimmer {
          background: linear-gradient(90deg, #C49A6C 0%, #FFD580 40%, #A67C52 60%, #E8C87A 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldFlow 3s linear infinite;
        }
        @keyframes goldFlow {
          0%   { background-position: 0%   center; }
          100% { background-position: 200% center; }
        }

        .nav-link-underline {
          position: relative;
          overflow: hidden;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #FFD580, transparent);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.active::after {
          transform: translateX(0);
        }

        .menu-btn-line {
          display: block;
          width: 22px;
          height: 1px;
          background: #C49A6C;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease;
          transform-origin: center;
        }

        .mobile-overlay {
          background: linear-gradient(160deg, #1C1410 0%, #231810 50%, #0F0A06 100%);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 w-full"
        style={{
          background: scrolled
            ? "linear-gradient(180deg, rgba(22,14,8,0.97) 0%, rgba(18,11,6,0.95) 100%)"
            : "linear-gradient(180deg, rgba(22,14,8,0.85) 0%, rgba(15,10,6,0.80) 100%)",
          backdropFilter: "blur(16px) saturate(180%)",
          borderBottom: scrolled
            ? "1px solid rgba(166,124,82,0.25)"
            : "1px solid rgba(166,124,82,0.12)",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
          transition: "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
        }}
      >
        {/* Gold top rule */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #8B6A46 20%, #FFD580 50%, #8B6A46 80%, transparent 100%)",
            opacity: scrolled ? 0.8 : 0.5,
            transition: "opacity 0.5s ease",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

          {/* ── LOGO ── */}
          <Link href="/" className="relative group flex items-center gap-3">
            {/* Glyph badge */}
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #8B6A46, #C49A6C)",
                boxShadow: "0 0 12px rgba(166,124,82,0.35)",
              }}
            >
              <span className="text-[#FAF6EF] text-xs" style={{ fontFamily: "'Cormorant Garamond',serif" }}>φ</span>
            </motion.div>

            <div>
              <span className="nav-logo text-xl gold-shimmer tracking-wide">
                PhiloVibes
              </span>
              {/* Tagline — only on wide screens */}
              <span
                className="hidden lg:block text-[9px] tracking-[0.35em] uppercase mt-0.5 leading-none"
                style={{ fontFamily: "'Cormorant Garamond',serif", color: "rgba(166,124,82,0.45)" }}
              >
                Philosophy · Reflection
              </span>
            </div>
          </Link>

          {/* ── DESKTOP LINKS ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`nav-link-font nav-link-underline relative flex items-center gap-1.5 px-4 py-2 text-sm tracking-widest uppercase transition-all duration-300 ${
                      isActive ? "active" : ""
                    }`}
                    style={{
                      letterSpacing: "0.15em",
                      color: isActive
                        ? "#D4B896"
                        : hoveredLink === link.href
                        ? "#C49A6C"
                        : "rgba(212,184,150,0.5)",
                      fontSize: "0.72rem",
                    }}
                  >
                    {/* Glyph */}
                    <AnimatePresence>
                      {(isActive || hoveredLink === link.href) && (
                        <motion.span
                          key="glyph"
                          initial={{ opacity: 0, scale: 0.5, width: 0 }}
                          animate={{ opacity: 1, scale: 1, width: "auto" }}
                          exit={{ opacity: 0, scale: 0.5, width: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-[#A67C52] text-xs overflow-hidden"
                        >
                          {link.glyph}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {link.label}

                    {/* Active dot */}
                    {isActive && (
                      <motion.span
                        layoutId="active-dot"
                        className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#FFD580" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* ── CTA button ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="ml-3"
            >
              <Link
                href="/playground"
                className="relative group overflow-hidden flex items-center gap-2 px-5 py-2 rounded-full text-[#FAF6EF] text-xs tracking-widest uppercase transition-all duration-300"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.2em",
                  background: "linear-gradient(135deg, #6B4F35, #A67C52, #C49A6C)",
                  backgroundSize: "200% 200%",
                  boxShadow: "0 0 20px rgba(166,124,82,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                  fontSize: "0.68rem",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundPosition = "right center";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(166,124,82,0.4), inset 0 1px 0 rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundPosition = "left center";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(166,124,82,0.2), inset 0 1px 0 rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "0.85rem" }}>✦</span>
                Reflect
              </Link>
            </motion.div>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-lg relative"
            style={{ background: "rgba(166,124,82,0.08)", border: "1px solid rgba(166,124,82,0.2)" }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span
              className="menu-btn-line"
              style={{
                transform: menuOpen ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="menu-btn-line"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="menu-btn-line"
              style={{
                transform: menuOpen ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>

        {/* Thin bottom glow line when scrolled */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          animate={{ opacity: scrolled ? 0.6 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "linear-gradient(90deg, transparent, #A67C52 30%, #FFD580 50%, #A67C52 70%, transparent)",
          }}
        />
      </motion.nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-overlay fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[180, 280, 380].map((size, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    width: size,
                    height: size,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderColor: `rgba(166,124,82,${0.08 - i * 0.02})`,
                  }}
                />
              ))}
            </div>

            {/* Corner glyphs */}
            <div className="absolute top-6 left-6 text-[#A67C52] opacity-20 text-xl">✦</div>
            <div className="absolute top-6 right-6 text-[#A67C52] opacity-20 text-xl">✦</div>
            <div className="absolute bottom-6 left-6 text-[#A67C52] opacity-20 text-xl">✦</div>
            <div className="absolute bottom-6 right-6 text-[#A67C52] opacity-20 text-xl">✦</div>

            {/* Logo in mobile menu */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-14 text-center"
            >
              <span
                className="nav-logo text-3xl gold-shimmer"
              >
                PhiloVibes
              </span>
              <div
                className="h-px mt-3 mx-auto w-24"
                style={{ background: "linear-gradient(90deg, transparent, #A67C52, transparent)" }}
              />
            </motion.div>

            {/* Links */}
            <nav className="flex flex-col items-center gap-2 w-full px-12">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: "easeOut" }}
                    className="w-full"
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between w-full px-6 py-4 rounded-xl transition-all duration-300"
                      style={{
                        background: isActive
                          ? "rgba(166,124,82,0.1)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isActive ? "rgba(166,124,82,0.3)" : "rgba(166,124,82,0.08)"}`,
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span
                        className="nav-link-font text-2xl tracking-widest uppercase"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: isActive ? "#D4B896" : "rgba(212,184,150,0.55)",
                          letterSpacing: "0.18em",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {link.label}
                      </span>
                      <span
                        className="text-lg transition-all duration-300"
                        style={{
                          color: isActive ? "#FFD580" : "rgba(166,124,82,0.3)",
                          transform: isActive ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        {link.glyph}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-10"
            >
              <Link
                href="/playground"
                className="flex items-center gap-2 px-8 py-3 rounded-full text-[#FAF6EF] text-sm tracking-widest uppercase"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.2em",
                  background: "linear-gradient(135deg, #6B4F35, #A67C52, #C49A6C)",
                  boxShadow: "0 0 30px rgba(166,124,82,0.3)",
                }}
              >
                <span>✦</span>
                Begin Reflecting
              </Link>
            </motion.div>

            {/* Close hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="absolute bottom-8 text-center text-[#8B6A46]/35 text-xs tracking-widest"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
            >
              tap anywhere to close
            </motion.p>

            {/* Tap anywhere to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setMenuOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
