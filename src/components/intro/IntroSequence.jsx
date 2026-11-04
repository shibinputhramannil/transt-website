import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import lockup from '../../assets/brand/transt-lockup.png';
import { site } from '../../data/site.js';
import { ease } from '../../motion/tokens.js';
import styles from './IntroSequence.module.css';

const SEEN_KEY = 'transt:intro-seen';

/** Play once per session, only when the visit starts on the homepage, never under reduced motion. */
export function shouldPlayIntro(pathname) {
  if (typeof window === 'undefined') return false;
  if (pathname !== '/') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true; // storage unavailable — play once for this page load
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* ignore */
  }
}

/* Geometry of the supplied lockup image (702 × 235 px after cropping). */
const IMG_W = 702;
const MARK = { cx: 118.5, cy: 117, r: 110 };
// Letter clip boundaries (x, px) found at the lowest-ink columns between glyphs: t r a n s t
const LETTERS = [247, 325, 387, 468, 564, 639, 702];
// Offset that centres the mark alone on screen before the wordmark arrives.
const MARK_SHIFT = `${(((IMG_W / 2 - MARK.cx) / IMG_W) * 100).toFixed(2)}%`;

const T = {
  arcs: 0.15,
  disc: 1.15,
  mark: 1.45,
  slide: 1.95,
  letters: 2.05,
  tagline: 2.7,
  reveal: 3.75,
};

function arc(r, start, end) {
  const p = (a) => [MARK.cx + r * Math.cos((a * Math.PI) / 180), MARK.cy + r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(start);
  const [x2, y2] = p(end);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const ARCS = [
  { d: arc(98, -200, 40), w: 5, delay: 0 },
  { d: arc(78, -20, 190), w: 4, delay: 0.12 },
  { d: arc(56, 120, 330), w: 3, delay: 0.24 },
];

export default function IntroSequence({ onReveal, onDone }) {
  const markRef = useRef(null);
  const [revealing, setRevealing] = useState(false);
  const revealingRef = useRef(false);
  const radius = useMotionValue(0);
  const cx = useMotionValue(50);
  const cy = useMotionValue(50);
  const mask = useMotionTemplate`radial-gradient(circle at ${cx}% ${cy}%, transparent ${radius}px, #000 calc(${radius}px + 1px))`;

  const reveal = useCallback(
    (fast = false) => {
      if (revealingRef.current) return;
      revealingRef.current = true;
      setRevealing(true);
      document.body.classList.remove('is-locked');
      const el = markRef.current;
      if (el) {
        const b = el.getBoundingClientRect();
        cx.set(((b.left + b.width / 2) / window.innerWidth) * 100);
        cy.set(((b.top + b.height / 2) / window.innerHeight) * 100);
      }
      onReveal?.();
      const target = Math.hypot(window.innerWidth, window.innerHeight) * 1.05;
      animate(radius, target, {
        duration: fast ? 0.7 : 1.1,
        ease: ease.inOut,
        onComplete: onDone,
      });
    },
    [cx, cy, radius, onReveal, onDone],
  );

  useEffect(markIntroSeen, []);

  // Timeline end → circular reveal.
  useEffect(() => {
    const t = setTimeout(() => reveal(false), T.reveal * 1000);
    return () => clearTimeout(t);
  }, [reveal]);

  // Lock scroll while the intro covers the page; Esc skips.
  useEffect(() => {
    document.body.classList.add('is-locked');
    const onKey = (e) => {
      if (e.key === 'Escape') reveal(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [reveal]);

  const words = site.tagline.split(' ');

  return (
    <motion.div
      className={styles.overlay}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      aria-label="TRANST introduction"
      role="dialog"
      aria-modal="false"
    >
      <motion.div
        className={styles.stage}
        animate={revealing ? { scale: 1.06, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: ease.out }}
      >
        <motion.div
          className={styles.lockup}
          initial={{ x: MARK_SHIFT }}
          animate={{ x: '0%' }}
          transition={{ duration: 1.0, ease: ease.inOut, delay: T.slide }}
        >
          {/* 1 — geometric arcs assemble with a controlled rotation */}
          <svg className={styles.arcs} viewBox={`0 0 ${IMG_W} 235`} aria-hidden="true">
            <motion.circle
              cx={MARK.cx}
              cy={MARK.cy}
              r={MARK.r}
              className={styles.disc}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{
                scale: { duration: 0.55, ease: ease.out, delay: T.disc },
                // hand over to the real mark, then get out of the way so no rim shows
                opacity: { duration: 0.3, delay: T.mark + 0.55 },
              }}
            />
            <motion.g
              initial={{ rotate: -140, opacity: 1 }}
              animate={{ rotate: 0, opacity: 0 }}
              transition={{
                rotate: { duration: 1.5, ease: ease.inOut, delay: T.arcs },
                opacity: { duration: 0.35, delay: T.mark + 0.15 },
              }}
            >
              {/* invisible anchor: centres the group's bbox on the mark so rotation pivots correctly */}
              <circle cx={MARK.cx} cy={MARK.cy} r={MARK.r} fill="none" />
              {ARCS.map((a, i) => (
                <motion.path
                  key={i}
                  d={a.d}
                  strokeWidth={a.w}
                  className={styles.arc}
                  initial={{ pathLength: 0, stroke: '#245C49' }}
                  animate={{ pathLength: 1, stroke: '#FEF9EC' }}
                  transition={{
                    pathLength: { duration: 1.1, ease: ease.inOut, delay: T.arcs + a.delay },
                    stroke: { duration: 0.3, delay: T.disc + 0.1 },
                  }}
                />
              ))}
            </motion.g>
          </svg>

          {/* 2 — the real mark resolves from the assembled arcs */}
          <motion.img
            src={lockup}
            alt=""
            className={styles.slice}
            style={{ clipPath: `inset(0 ${(100 - (LETTERS[0] / IMG_W) * 100).toFixed(3)}% 0 0)` }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: ease.out, delay: T.mark }}
            draggable={false}
          />
          <span
            ref={markRef}
            className={styles.markBox}
            style={{ width: `${((LETTERS[0] / IMG_W) * 100).toFixed(3)}%` }}
            aria-hidden="true"
          />

          {/* 3 — staggered wordmark reveal using slices of the actual logo */}
          {LETTERS.slice(0, -1).map((left, i) => {
            const right = LETTERS[i + 1];
            return (
              <motion.img
                key={left}
                src={lockup}
                alt=""
                className={styles.slice}
                style={{
                  clipPath: `inset(-20% ${(100 - (right / IMG_W) * 100).toFixed(3)}% -20% ${((left / IMG_W) * 100).toFixed(3)}%)`,
                }}
                initial={{ opacity: 0, y: '18%' }}
                animate={{ opacity: 1, y: '0%' }}
                transition={{ duration: 0.7, ease: ease.out, delay: T.letters + i * 0.075 }}
                draggable={false}
              />
            );
          })}
          <span className="visually-hidden">TRANST</span>
        </motion.div>

        {/* 4 — tagline */}
        <p className={styles.tagline} aria-label={site.tagline}>
          {words.map((w, i) => (
            <span key={i} className={styles.wordMask} aria-hidden="true">
              <motion.span
                className={styles.word}
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, ease: ease.out, delay: T.tagline + i * 0.06 }}
              >
                {i === 3 ? <em>{w}</em> : w}
              </motion.span>
            </span>
          ))}
        </p>
      </motion.div>

      <motion.div
        className={styles.progress}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: T.reveal, ease: 'linear' }}
        aria-hidden="true"
      />

      <button type="button" className={styles.skip} onClick={() => reveal(true)}>
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </motion.div>
  );
}
