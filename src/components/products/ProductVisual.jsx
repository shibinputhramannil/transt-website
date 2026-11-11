import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import ProductGlyph from './ProductGlyph.jsx';
import styles from './ProductVisual.module.css';

/**
 * Product hero visual: the product's glyph on a tilting glass stage, orbited by
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
    if (reduce || !inView) return undefined;
    const t = setInterval(() => setPulse((p) => !p), 2600);
    return () => clearInterval(t);
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
  const chipPos = [
    { left: '-4%', top: '14%' },
    { right: '-6%', top: '42%' },
    { left: '6%', bottom: '8%' },
  ];

  return (
    <div ref={ref} className={styles.wrap} onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <motion.div className={styles.stage} style={{ rotateX, rotateY }}>
        <div className={styles.plate} />
        <div className={styles.ring} />
        <div className={styles.glyph}>
          <ProductGlyph seed={product.slug} active={pulse} />
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
