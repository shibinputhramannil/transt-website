import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import ProductArt from './art/ProductArt.jsx';
import styles from './ProductVisual.module.css';

// While the hero is on screen its illustration replays slowly: the story plays and holds, then
// rests, about every 6.6 s (ambient loops stay at 6 s or slower and stop off-screen).
const PLAY_MS = 5200;
const REST_MS = 1400;

/**
 * Product hero visual: the product's illustration on a tilting glass stage, orbited by
 * capability chips. Tilts toward the pointer on desktop; static under reduced motion.
 */
export default function ProductVisual({ product }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  const [pulse, setPulse] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);

  useEffect(() => {
    if (reduce || !inView) {
      setPulse(false);
      return undefined;
    }
    let on = false;
    let timer;
    const tick = () => {
      on = !on;
      setPulse(on);
      timer = setTimeout(tick, on ? PLAY_MS : REST_MS);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [reduce, inView]);

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const b = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - b.left) / b.width) * 2 - 1);
    my.set(((e.clientY - b.top) / b.height) * 2 - 1);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const chips = product.capabilities.slice(0, 3).map((c) => c.title);
  // Chips sit around the rim, clear of the illustration in the middle.
  const chipPos = [
    { left: '-4%', top: '14%' },
    { right: '-6%', top: '3%' },
    { left: '6%', bottom: '8%' },
  ];

  return (
    <div ref={ref} className={styles.wrap} onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <motion.div className={styles.stage} style={{ rotateX, rotateY }}>
        <div className={styles.plate} />
        <div className={styles.ring} />
        <div className={styles.glyph}>
          <ProductArt product={product} active={pulse} />
        </div>
        {chips.map((c, i) => (
          <motion.span
            key={c}
            className={styles.chip}
            // depth goes through Framer Motion: its y animation writes the whole transform,
            // which would otherwise drop the CSS translateZ and put the chip behind the glyph
            style={{ ...chipPos[i], z: 90 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: reduce || !inView ? 0 : [0, -6, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.15, duration: 0.6 },
              y: { delay: 0.5 + i * 0.15, duration: 5 + i, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <span className={styles.chipDot} />
            {c}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
