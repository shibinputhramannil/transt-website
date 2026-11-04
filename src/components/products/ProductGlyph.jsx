import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '../../motion/tokens.js';
import styles from './ProductGlyph.module.css';

/**
 * Deterministic generative emblem for a product, derived from its slug.
 * Gives every catalog entry a distinct visual identity without stock imagery.
 * `active` (e.g. card hover) brings arcs into alignment and lights the nodes.
 */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

const arc = (r, a0, a1) => {
  const p = (a) => [100 + r * Math.cos((a * Math.PI) / 180), 100 + r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(a0);
  const [x2, y2] = p(a1);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
};

export default function ProductGlyph({ seed, active = false, className = '' }) {
  const reduce = useReducedMotion();
  const g = useMemo(() => {
    const r = rng(hash(seed));
    const rings = [34, 54, 74].map((rad, i) => {
      const start = Math.floor(r() * 360);
      const len = 90 + Math.floor(r() * 150);
      return { rad, d: arc(rad, start, start + len), spin: (i % 2 ? -1 : 1) * (20 + Math.floor(r() * 40)) };
    });
    const nodeCount = 3 + Math.floor(r() * 3);
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const a = (360 / nodeCount) * i + r() * 30;
      const rad = [54, 74][Math.floor(r() * 2)];
      return { x: 100 + rad * Math.cos((a * Math.PI) / 180), y: 100 + rad * Math.sin((a * Math.PI) / 180) };
    });
    return { rings, nodes };
  }, [seed]);

  const t = { duration: reduce ? 0 : 0.9, ease: ease.out };

  return (
    <svg viewBox="0 0 200 200" className={`${styles.glyph} ${active ? styles.active : ''} ${className}`} aria-hidden="true">
      <circle cx="100" cy="100" r="88" className={styles.base} />
      {g.nodes.map((n, i) => (
        <line key={`l${i}`} x1="100" y1="100" x2={n.x} y2={n.y} className={styles.link} />
      ))}
      {g.rings.map((ring, i) => (
        <motion.g key={i} animate={{ rotate: active ? ring.spin : 0 }} transition={t}>
          {/* invisible anchor keeps the rotation pivot on the glyph centre */}
          <circle cx="100" cy="100" r="88" fill="none" />
          <path d={ring.d} className={i === 1 ? styles.arcWarm : styles.arc} />
        </motion.g>
      ))}
      {g.nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r="4" className={styles.node} />
      ))}
      <circle cx="100" cy="100" r="16" className={styles.core} />
      <circle cx="100" cy="100" r="5" className={styles.coreDot} />
    </svg>
  );
}
