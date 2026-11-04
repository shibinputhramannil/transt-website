import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SplitText from '../ui/SplitText.jsx';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { capabilities } from '../../data/approach.js';
import { services } from '../../data/services.js';
import { ease } from '../../motion/tokens.js';
import styles from './WhatWeDo.module.css';

/** Small line icons that draw once when their pillar enters the viewport. */
function PillarIcon({ id }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const draw = (delay = 0) =>
    reduce
      ? { initial: false }
      : {
          initial: { pathLength: 0 },
          animate: seen ? { pathLength: 1 } : {},
          transition: { duration: 0.9, ease: ease.inOut, delay },
        };

  return (
    <svg ref={ref} viewBox="0 0 64 64" className={styles.icon} aria-hidden="true">
      <circle cx="32" cy="32" r="30" className={styles.iconRing} />
      {id === 'understand' && (
        <>
          <motion.path d="M20 18h18l8 8v20H20z" {...draw(0)} />
          <motion.path d="M25 30h16M25 36h16M25 42h10" {...draw(0.3)} />
          <motion.path d="M14 26h36" className={styles.scan} {...draw(0.6)} />
        </>
      )}
      {id === 'decide' && (
        <>
          <motion.path d="M32 14l8 8-8 8-8-8z" {...draw(0)} />
          <motion.path d="M32 30v6M32 36l-12 10M32 36l12 10" {...draw(0.35)} />
          <motion.circle cx="20" cy="48" r="3" {...draw(0.7)} />
          <motion.circle cx="44" cy="48" r="3" className={styles.scan} {...draw(0.8)} />
        </>
      )}
      {id === 'act' && (
        <>
          <motion.circle cx="18" cy="32" r="4" {...draw(0)} />
          <motion.circle cx="32" cy="20" r="4" {...draw(0.15)} />
          <motion.circle cx="46" cy="32" r="4" {...draw(0.3)} />
          <motion.path d="M21 29l8-6M35 23l8 6M46 36v8H22" {...draw(0.45)} />
          <motion.path d="M26 40l-4 4 4 4" className={styles.scan} {...draw(0.8)} />
        </>
      )}
    </svg>
  );
}

export default function WhatWeDo() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // Section transition: the dark panel opens from an inset card to full bleed as it scrolls in.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  // clip-path (repaint only) rather than margins (layout) — insets 3% each side and 36px corners at the start.
  const clip = useTransform(scrollYProgress, (p) => {
    if (reduce) return 'none';
    const k = 1 - Math.min(1, Math.max(0, p));
    return `inset(0% ${(k * 3).toFixed(2)}% round ${(k * 36).toFixed(1)}px)`;
  });

  return (
    <section ref={ref} className={styles.section} aria-labelledby="what-title" id="what-we-do">
      <motion.div className={`on-dark ${styles.panel}`} style={{ clipPath: clip }}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={`container ${styles.inner}`}>
          <div className={styles.head}>
            <Reveal as="p" className="eyebrow">
              What we do
            </Reveal>
            <SplitText
              as="h2"
              id="what-title"
              className={`t-h1 ${styles.statement}`}
              text="We build software that can *understand,* *decide* and *act* — inside the way your business already works."
              stagger={0.03}
            />
            <Reveal as="p" className={`t-lead ${styles.lead}`} delay={0.15}>
              TRANST combines product engineering with applied AI. Every system we deliver is designed around real work,
              real data and the people who are responsible for it.
            </Reveal>
          </div>

          <RevealGroup as="ol" role="list" className={styles.pillars} stagger={0.12}>
            {capabilities.map((c, i) => (
              <RevealItem as="li" key={c.id} className={styles.pillar}>
                <PillarIcon id={c.id} />
                <span className={`t-mono ${styles.num}`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3">{c.title}</h3>
                <p className="t-body">{c.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className={styles.delivered}>
            <span className="t-mono">Delivered as</span>
            <ul role="list">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#service-${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
