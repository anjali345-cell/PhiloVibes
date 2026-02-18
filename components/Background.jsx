'use client';

import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 20 }).map(() => ({
  initial: {
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: 0.5,
    scale: 0,
  },
  animate: {
    y: [Math.random() * 100, -20],
    opacity: [0.5, 0],
    scale: [1, 0.5],
  },
  transition: {
    duration: 12 + Math.random() * 8,
    repeat: Infinity,
    delay: Math.random() * 5,
    ease: 'easeInOut',
  },
}));

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#101020] to-[#1a1a2e]">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-yellow-200/30"
          initial={p.initial}
          animate={p.animate}
          transition={p.transition}
        />
      ))}
    </div>
  );
}
