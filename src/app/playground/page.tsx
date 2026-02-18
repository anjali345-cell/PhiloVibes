"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePhiloFonts } from "../../../components/Usephilofonts";
import {
  HeroBackground,
  ReflectCanvas,
  RevealText,
  ScrambleText,
  THEMES,
  type AnimTheme,
} from "../../../components/Playgroundanimations";

export default function PlaygroundPage() {
  usePhiloFonts();

  const [quote,      setQuote]      = useState("");
  const [author,     setAuthor]     = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [theme,      setTheme]      = useState<AnimTheme>(0);
  const [animKey,    setAnimKey]    = useState(0);
  const [charCount,  setCharCount]  = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReflect = useCallback(() => {
    if (!quote.trim()) { textareaRef.current?.focus(); return; }
    // Always pick a different theme than the previous one
    setTheme(prev => { let n: AnimTheme; do { n = Math.floor(Math.random()*6) as AnimTheme; } while (n === prev); return n; });
    setAnimKey(k => k + 1);
    setSubmitted(true);
  }, [quote]);

  const handleReset = () => { setQuote(""); setAuthor(""); setSubmitted(false); setCharCount(0); };

  return (
    <>
      <style>{`
        .font-display  { font-family: 'DM Serif Display', Georgia, serif; }
        .font-body     { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-italic   { font-family: 'Libre Baskerville', Georgia, serif; font-style: italic; }

        .gold-text {
          background: linear-gradient(135deg, #C49A6C 0%, #FFD580 40%, #A67C52 60%, #E8C87A 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .shine-border { position: relative; }
        .shine-border::before {
          content: ''; position: absolute; inset: -1px; border-radius: inherit; z-index: -1;
          background: linear-gradient(135deg, #D4B896, #8B6A46, #FFD580, #A67C52, #D4B896);
          background-size: 300% 300%; animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .grain-overlay { position: relative; }
        .grain-overlay::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
          opacity: 0.35; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
        }
        .textarea-glow:focus {
          box-shadow: 0 0 0 1px #A67C52, 0 0 30px rgba(166,124,82,0.15);
          outline: none;
        }
        .reflect-btn {
          background: linear-gradient(135deg, #8B6A46, #A67C52, #C49A6C);
          background-size: 200% 200%;
          transition: all 0.4s ease;
        }
        .reflect-btn:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(166,124,82,0.35);
        }
        .quote-mark {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 8rem; line-height: 0.7;
          color: #A67C52; opacity: 0.12;
          position: absolute; font-style: italic; user-select: none;
        }
      `}</style>

      {/* ── Page shell ── */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg,#1C1410 0%,#231810 40%,#1A120C 70%,#0F0A06 100%)" }}
      >
        {/* 3D background — lives in its own file */}
        <HeroBackground />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(15,10,6,0.55) 100%)" }} />

        {/* Gold rules */}
        <div className="absolute top-0    left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,#A67C52 30%,#FFD580 50%,#A67C52 70%,transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,#A67C52 30%,#FFD580 50%,#A67C52 70%,transparent)" }} />

        {/* Corner glyphs */}
        {["top-6 left-8","top-6 right-8","bottom-6 left-8","bottom-6 right-8"].map(p => (
          <div key={p} className={`absolute ${p} text-[#A67C52] opacity-25 text-xl font-display select-none pointer-events-none`}>✦</div>
        ))}

        {/* ── Content ── */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(90deg,transparent,#A67C52)" }} />
              <span className="text-[#D4B896] text-xs tracking-[0.4em] uppercase font-body">Contemplation</span>
              <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(90deg,#A67C52,transparent)" }} />
            </div>
            <h1 className="font-display text-6xl md:text-7xl gold-text mb-4 leading-none tracking-tight">
              Playground
            </h1>
            <p className="font-body text-[#D4B896] text-xl tracking-wide" style={{ fontStyle: "italic" }}>
              Where thoughts become philosophy
            </p>
          </motion.div>

          {/* ── Form / Reflect toggle ── */}
          <AnimatePresence mode="wait">

            {/* FORM */}
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-16, scale:0.97 }}
                transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                className="w-full"
              >
                <div
                  className="shine-border grain-overlay rounded-2xl p-8 relative"
                  style={{ background:"linear-gradient(145deg,rgba(40,26,16,0.92),rgba(28,20,10,0.95))", border:"1px solid rgba(166,124,82,0.22)" }}
                >
                  {/* Quote input */}
                  <label className="block text-[#D4B896] text-xs tracking-[0.35em] uppercase mb-3 font-body">
                    Your Thought
                  </label>
                  <textarea
                    ref={textareaRef}
                    rows={4}
                    placeholder="Write what moves you…"
                    value={quote}
                    onChange={e => { setQuote(e.target.value); setCharCount(e.target.value.length); }}
                    onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleReflect(); }}
                    className="textarea-glow w-full resize-none bg-transparent text-[#F0E8D8] font-body text-xl leading-relaxed tracking-wide placeholder:text-[#A67C52]/60 border-b border-[#A67C52]/20 pb-4 mb-6"
                    style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem" }}
                  />

                  {/* Author + char count */}
                  <div className="flex items-end justify-between mb-6">
                    <div className="flex-1 mr-6">
                      <label className="block text-[#D4B896] text-xs tracking-[0.35em] uppercase mb-2 font-body">
                        Attribution <span className="opacity-60 normal-case tracking-normal text-[10px]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="— who said this?"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className="w-full bg-transparent text-[#D4B896] font-body text-base tracking-wider placeholder:text-[#A67C52]/60 focus:outline-none border-b border-[#A67C52]/15 pb-2"
                        style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}
                      />
                    </div>
                    <span className="text-[#C49A6C] text-xs font-mono tabular-nums">{charCount}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#C49A6C] text-xs tracking-wide font-body">⌘ + Enter to reflect</span>
                    <motion.button
                      onClick={handleReflect}
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      className="reflect-btn text-[#FAF6EF] px-8 py-3 rounded-lg font-body tracking-widest text-sm uppercase"
                      style={{ fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.2em" }}
                    >
                      Reflect
                    </motion.button>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6, duration:0.8 }}
                  className="text-center text-[#C49A6C] text-sm mt-6 font-body tracking-wide"
                  style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}
                >
                  Each reflection conjures a unique universe
                </motion.p>
              </motion.div>

            ) : (

              /* REFLECT CARD */
              <motion.div
                key={`reflect-${animKey}`}
                initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0, scale:0.95, y:-10 }}
                transition={{ duration:0.65, ease:[0.16,1,0.3,1] }}
                className="w-full"
              >
                <div
                  className="shine-border grain-overlay rounded-2xl overflow-hidden relative"
                  style={{ background:"linear-gradient(145deg,rgba(40,26,16,0.97),rgba(22,14,8,0.99))", border:"1px solid rgba(212,184,150,0.2)" }}
                >
                  {/* Animation viewport */}
                  <div className="relative h-60 overflow-hidden">
                    <ReflectCanvas theme={theme} animKey={animKey} />

                    {/* Fade into card body */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background:"linear-gradient(to bottom,rgba(28,20,10,0.05) 0%,transparent 40%,rgba(22,14,8,0.88) 100%)" }} />

                    {/* Theme label */}
                    <motion.div
                      initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4, duration:0.5 }}
                      className="absolute top-4 left-5 flex items-center gap-2"
                    >
                      <span className="text-[#A67C52] text-lg">{THEMES[theme].glyph}</span>
                      <div>
                        <p className="text-[#D4B896] text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily:"'Cormorant Garamond',serif" }}>
                          {THEMES[theme].name}
                        </p>
                        <p className="text-[#C49A6C] text-[9px] italic mt-0.5" style={{ fontFamily:"'Cormorant Garamond',serif" }}>
                          {THEMES[theme].tagline}
                        </p>
                      </div>
                    </motion.div>

                    {/* Reflect counter badge */}
                    <motion.div
                      initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.6 }}
                      className="absolute top-4 right-5 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background:"rgba(166,124,82,0.15)", border:"1px solid rgba(166,124,82,0.3)" }}
                    >
                      <span className="text-[#C49A6C] text-[10px]" style={{ fontFamily:"'Cormorant Garamond',serif" }}>{animKey}</span>
                    </motion.div>
                  </div>

                  {/* Quote body */}
                  <div className="relative px-8 pt-4 pb-8">
                    <span className="quote-mark top-0 left-4">"</span>

                    <div className="relative z-10 mb-6">
                      <RevealText
                        text={quote}
                        delay={0.1}
                        className="font-display text-[#F0E8D8] text-2xl md:text-3xl leading-relaxed tracking-wide block mb-4"
                      />
                      {author && (
                        <motion.div
                          initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay:0.3 + quote.length*0.025, duration:0.5 }}
                          className="flex items-center gap-3 mt-4"
                        >
                          <div className="h-px w-8" style={{ background:"linear-gradient(90deg,transparent,#A67C52)" }} />
                          <span className="font-italic text-[#A67C52] text-sm tracking-wider">{author}</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Gold divider */}
                    <motion.div
                      initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                      transition={{ delay:0.5, duration:0.8, ease:[0.22,1,0.36,1] }}
                      className="h-px mb-6"
                      style={{ background:"linear-gradient(90deg,transparent,#A67C52 20%,#D4B896 50%,#A67C52 80%,transparent)", originX:0 }}
                    />

                    <motion.p
                      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:0.6 }}
                      className="text-[#D4B896] text-base italic mb-6 font-body tracking-wide leading-relaxed"
                      style={{ fontFamily:"'Cormorant Garamond',serif" }}
                    >
                      A moment of thought is a spark of your own philosophy.
                    </motion.p>

                    <motion.div
                      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                      className="flex items-center justify-between"
                    >
                      <button
                        onClick={handleReset}
                        className="group flex items-center gap-2 text-[#D4B896] hover:text-[#FFD580] transition-colors duration-300 font-body text-sm tracking-widest uppercase"
                        style={{ fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.18em" }}
                      >
                        <span className="text-lg transition-transform group-hover:-translate-x-1 duration-300">←</span>
                        Write another
                      </button>
                      <div className="text-[#C49A6C] text-xs tracking-widest uppercase" style={{ fontFamily:"'Cormorant Garamond',serif" }}>
                        Playground
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0, duration:0.6 }}
                  className="text-center mt-5 text-[#C49A6C] text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily:"'Cormorant Garamond',serif" }}
                >
                  <ScrambleText text="Each reflection is singular" />
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}