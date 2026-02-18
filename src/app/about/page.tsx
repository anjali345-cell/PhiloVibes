"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

// ─── Fonts ────────────────────────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Serif+Display:ital@0;1&family=Libre+Baskerville:ital@1&display=swap";
    document.head.appendChild(link);
    // return () => document.head.removeChild(link);
  }, []);
}

// ─── Three.js: Sacred Geometry Sphere ────────────────────────────────────────
function PhiloSphere() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 5;

    // Lighting
    scene.add(new THREE.AmbientLight(0xfff8e8, 0.5));
    const key = new THREE.DirectionalLight(0xffd580, 2.5); key.position.set(3, 5, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xa67c52, 1.5); rim.position.set(-4, -2, 2); scene.add(rim);

    // Central glass sphere
    const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8b89c,
      metalness: 0.05,
      roughness: 0.0,
      transmission: 0.9,
      thickness: 1.5,
      transparent: true,
      opacity: 0.45,
      ior: 1.45,
      envMapIntensity: 1.2,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Outer wireframe icosphere
    const icoGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xc49a6c, wireframe: true, transparent: true, opacity: 0.15 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // Orbital rings
    const ringData = [
      { r: 1.85, tube: 0.008, color: 0xffd580, rx: Math.PI/2,   ry: 0,       speed: 0.003 },
      { r: 2.1,  tube: 0.006, color: 0xa67c52, rx: Math.PI/3,   ry: 0.4,     speed: -0.004 },
      { r: 1.55, tube: 0.010, color: 0xd4b896, rx: Math.PI/1.7, ry: -0.3,    speed: 0.002 },
    ];
    const rings = ringData.map(d => {
      const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.45 });
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(d.r, d.tube, 6, 120), mat);
      mesh.rotation.set(d.rx, d.ry, 0);
      scene.add(mesh);
      return { mesh, speed: d.speed };
    });

    // Floating mandala dots
    const dotPts: number[] = [], dotCol: number[] = [];
    for (let layer = 1; layer <= 4; layer++) {
      const count = layer * 10, r = layer * 0.42;
      const c = new THREE.Color().setHSL(0.08 + layer * 0.01, 0.75, 0.65);
      for (let j = 0; j < count; j++) {
        const a = (j / count) * Math.PI * 2;
        dotPts.push(Math.cos(a) * r, Math.sin(a) * r, (Math.random() - 0.5) * 0.2);
        dotCol.push(c.r, c.g, c.b);
      }
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPts, 3));
    dotGeo.setAttribute("color",    new THREE.Float32BufferAttribute(dotCol, 3));
    const dotMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    // Small floating satellite orbs
    const satellites: { mesh: THREE.Mesh; angle: number; radius: number; speed: number; yOffset: number }[] = [];
    const satColors = [0xd4a0c8, 0xc8c0d8, 0xe8e0d0];
    satColors.forEach((color, i) => {
      const mat = new THREE.MeshPhysicalMaterial({ color, transmission: 0.85, roughness: 0, opacity: 0.5, transparent: true, ior: 1.4, thickness: 0.4 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12 + i * 0.06, 32, 32), mat);
      scene.add(mesh);
      satellites.push({ mesh, angle: (i / 3) * Math.PI * 2, radius: 2.4 + i * 0.3, speed: 0.006 - i * 0.001, yOffset: (i - 1) * 0.5 });
    });

    // Mouse
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 2; my = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMouse);

    let targetRX = 0, targetRY = 0;
    let animId: number;
    const clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      // Sphere rotation follows mouse
      targetRX += (-my * 0.4 - targetRX) * 0.04;
      targetRY += (mx  * 0.4 - targetRY) * 0.04;
      sphere.rotation.x = targetRX;
      sphere.rotation.y = t * 0.08 + targetRY;
      ico.rotation.x = t * 0.05; ico.rotation.y = t * 0.08;
      dots.rotation.z = t * 0.06; dots.rotation.y = t * 0.04;

      rings.forEach(r => { r.mesh.rotation.y += r.speed; r.mesh.rotation.z += r.speed * 0.5; });

      satellites.forEach(s => {
        s.angle += s.speed;
        s.mesh.position.set(Math.cos(s.angle) * s.radius, s.yOffset + Math.sin(t * 0.4) * 0.2, Math.sin(s.angle) * s.radius);
      });

      key.intensity = 2.5 + 0.3 * Math.sin(t * 0.7);
      renderer.render(scene, camera);
    };
    loop();

    const onResize = () => { const w = el.clientWidth, h = el.clientHeight; camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", onResize); cancelAnimationFrame(animId); renderer.dispose(); if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}

// ─── Animated section heading ─────────────────────────────────────────────────
function SectionHeading({ children, delay = 0 }: { children: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="relative">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        className="text-2xl text-[#F0DFC0] tracking-wide"
      >
        {children}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: delay + 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="h-px mt-2 origin-left"
        style={{ background: "linear-gradient(90deg, #A67C52, #FFD580 50%, transparent)" }}
      />
    </div>
  );
}

// ─── Animated paragraph ───────────────────────────────────────────────────────
function AnimPara({ children, delay = 0, className = "", style = {} }: { children: React.ReactNode; delay?: number; className?: string; style?: CSSProperties; }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, glyph, delay }: { value: string; label: string; glyph: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl p-6 flex flex-col items-center text-center group"
      style={{
        background: "linear-gradient(145deg, rgba(40,26,16,0.6), rgba(22,14,8,0.7))",
        border: "1px solid rgba(166,124,82,0.18)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span className="text-[#A67C52] text-lg mb-2 group-hover:scale-125 transition-transform duration-300">{glyph}</span>
      <span
        className="text-3xl font-light mb-1"
        style={{
          fontFamily: "'DM Serif Display', serif",
          background: "linear-gradient(135deg,#C49A6C,#FFD580,#A67C52)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}
      >
        {value}
      </span>
      <span className="text-[#C49A6C] text-xs tracking-widest uppercase" style={{ fontFamily: "'Cormorant Garamond',serif", letterSpacing: "0.2em" }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Pillar card ─────────────────────────────────────────────────────────────
function PillarCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative rounded-2xl p-7 overflow-hidden group cursor-default"
      style={{
        background: "linear-gradient(145deg, rgba(40,26,16,0.55), rgba(22,14,8,0.65))",
        border: "1px solid rgba(166,124,82,0.14)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(166,124,82,0.08) 0%, transparent 70%)" }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(90deg, transparent, #A67C52, transparent)" }}
      />
      <div className="text-2xl mb-4">{icon}</div>
      <h3
        className="text-[#F0DFC0] text-lg mb-3"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {title}
      </h3>
      <p
        className="text-[#D4B896] text-sm leading-relaxed"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", lineHeight: 1.7 }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

// ─── Tech tag ─────────────────────────────────────────────────────────────────
function TechTag({ name, delay }: { name: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-widest uppercase cursor-default"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: "0.15em",
        color: "#E8D5BC",
        background: "rgba(166,124,82,0.12)",
        border: "1px solid rgba(166,124,82,0.35)",
      }}
    >
      <span className="text-[#FFD580] text-[8px]">◆</span>
      {name}
    </motion.span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  useFonts();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const PILLARS = [
    { icon: "📖", title: "Curated Wisdom",    desc: "Every quote, every book, every thought is chosen with care. We don't flood you — we distill. Philosophy is not about quantity; it is about weight." },
    { icon: "🌿", title: "Quiet Reflection",  desc: "In a world of noise, PhiloVibes is a deliberate pause. An interface that breathes. A space that honors the slowness required for deep thought." },
    { icon: "✦",  title: "Your Own Voice",    desc: "The Playground exists not to teach you philosophy, but to let you practice it. Write your own thoughts. Coin your own aphorisms. Own your perspective." },
  ];

  const TECH = ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "React", "Vercel"];

  const STATS = [
    { value: "∞",    label: "Thoughts possible", glyph: "◎" },
    { value: "6",    label: "Reflect animations", glyph: "✦" },
    { value: "1",    label: "Soul inside",        glyph: "φ" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #1C1410 0%, #231810 40%, #1A120C 70%, #0F0A06 100%)" }}
    >
      <style>{`
        .gold-text {
          background: linear-gradient(135deg, #C49A6C 0%, #FFD580 40%, #A67C52 60%, #E8C87A 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #C49A6C 0%, #FFD580 40%, #A67C52 60%, #E8C87A 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          animation: goldFlow 4s linear infinite;
        }
        @keyframes goldFlow { 0%{ background-position:0% center } 100%{ background-position:200% center } }
        .section-divider {
          background: linear-gradient(90deg, transparent, #A67C52 20%, #FFD580 50%, #A67C52 80%, transparent);
        }
        blockquote { border-left: 2px solid #A67C52; }
      `}</style>

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-0.5 z-50 pointer-events-none"
        style={{ width: progressWidth, background: "linear-gradient(90deg, #8B6A46, #FFD580)" }}
      />

      {/* ── Top / bottom gold rules ── */}
      <div className="absolute top-0 left-0 right-0 h-px section-divider pointer-events-none" />

      {/* Corner ornaments */}
      {["top-6 left-8", "top-6 right-8"].map(pos => (
        <div key={pos} className={`absolute ${pos} text-[#A67C52] opacity-20 text-xl select-none pointer-events-none`}>✦</div>
      ))}

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 md:px-16 pt-10 pb-20 gap-10 lg:gap-0">

        {/* Left: text */}
        <div className="relative z-10 flex-1 max-w-xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #A67C52)" }} />
            <span
              className="text-[#D4B896] text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Philosophy
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="gold-shimmer mb-2"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(3rem, 6vw, 4.5rem)", lineHeight: 1.05 }}
          >
            PhiloVibes
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#C49A6C] mb-10"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
          >
            A calm corner for deep thinkers
          </motion.h2>

          {/* Main description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-[#E8D5BC] leading-loose mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}
          >
            PhiloVibes is a deliberate sanctuary for those who love philosophy, books, and quiet
            reflection. Not a social network. Not a feed. Just a{" "}
            <em className="text-[#FFD580]">space to think</em> — built with care and a little soul.
          </motion.p>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="pl-5 mb-10"
          >
            <p
              className="text-[#F0DFC0] italic leading-relaxed"
              style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "1.05rem" }}
            >
              "The unexamined life is not worth living."
            </p>
            <footer
              className="mt-2 text-[#C49A6C] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}
            >
              — Socrates
            </footer>
          </motion.blockquote>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <a
              href="/playground"
              className="flex items-center gap-2 px-7 py-3 rounded-full text-[#FAF6EF] text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(166,124,82,0.4)] hover:-translate-y-0.5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.2em",
                background: "linear-gradient(135deg, #6B4F35, #A67C52, #C49A6C)",
              }}
            >
              <span>✦</span> Start Reflecting
            </a>
            <a
              href="/explore"
              className="text-[#D4B896] hover:text-[#FFD580] text-sm tracking-widest uppercase transition-colors duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.15em", fontSize: "0.75rem" }}
            >
              Explore Quotes <span>→</span>
            </a>
          </motion.div>
        </div>

        {/* Right: 3D sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex items-center justify-center"
          style={{ minHeight: 420 }}
        >
          <div className="relative w-full max-w-sm aspect-square">
            <PhiloSphere />
            {/* Glow behind sphere */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none -z-10"
              style={{ background: "radial-gradient(circle, rgba(166,124,82,0.12) 0%, transparent 70%)", transform: "scale(1.4)" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative px-6 md:px-16 pb-20">
        <div className="h-px section-divider mb-16" />
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.1} />)}
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="relative px-6 md:px-16 pb-24 max-w-5xl mx-auto">
        <div className="mb-12">
          <SectionHeading>Three Pillars</SectionHeading>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => <PillarCard key={p.title} {...p} delay={i * 0.12} />)}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="relative px-6 md:px-16 pb-24 max-w-3xl mx-auto">
        <div className="h-px section-divider mb-16" />
        <SectionHeading delay={0.1}>A Small Manifesto</SectionHeading>

        <div className="mt-10 space-y-6">
          {[
            { text: "We believe that slowing down is not a failure — it is a practice. That every person who pauses to think is doing something radical in a world optimized for speed.", delay: 0.1 },
            { text: "We believe philosophy is not locked inside universities or dusty textbooks. It lives in the questions you ask yourself at 2am, in the margins of novels you loved, in the words that stopped you mid-sentence.", delay: 0.2 },
            { text: "We built PhiloVibes for that person. For you.", delay: 0.3 },
          ].map((item, i) => (
            <AnimPara
              key={i}
              delay={item.delay}
              className="text-[#E8D5BC] leading-loose"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" } as React.CSSProperties}
            >
              {item.text}
            </AnimPara>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-14 flex flex-col items-start gap-2"
        >
          <div className="h-px w-16" style={{ background: "linear-gradient(90deg, #A67C52, transparent)" }} />
          <span
            className="gold-text"
            style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "1.4rem" }}
          >
            Built with Next.js & a bit of soul
          </span>
        </motion.div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="relative px-6 md:px-16 pb-28 max-w-3xl mx-auto">
        <div className="h-px section-divider mb-16" />
        <SectionHeading>Built With</SectionHeading>

        <div className="mt-8 flex flex-wrap gap-3">
          {TECH.map((t, i) => <TechTag key={t} name={t} delay={i * 0.07} />)}
        </div>
      </section>

      {/* ── CLOSING QUOTE ── */}
      <section className="relative px-6 md:px-16 pb-28 max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl p-10 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(40,26,16,0.6), rgba(22,14,8,0.7))",
            border: "1px solid rgba(166,124,82,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Big decorative glyph */}
          <div
            className="absolute top-3 left-6 pointer-events-none"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "6rem", color: "#A67C52", opacity: 0.06, lineHeight: 1, fontStyle: "italic", userSelect: "none" }}
          >
            "
          </div>
          <span className="block text-[#FFD580] text-xl mb-6">◎</span>
          <p
            className="text-[#F0DFC0] leading-loose mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.25rem" }}
          >
            "Wisdom begins in wonder."
          </p>
          <footer
            className="text-[#C49A6C] text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.25em" }}
          >
            — Socrates
          </footer>
        </motion.div>
      </section>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px section-divider pointer-events-none" />
    </div>
  );
}