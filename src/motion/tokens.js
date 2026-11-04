/**
 * TRANST motion system.
 *
 * Rules:
 *  1. Motion explains — it reveals hierarchy, shows flow, or confirms input.
 *  2. One hero motion per viewport. Everything else is quiet.
 *  3. Enter with `ease.out`; move between states with `ease.inOut`.
 *  4. Nothing loops at full speed. Ambient loops are slow (≥ 6s) and pause off-screen.
 *  5. Under prefers-reduced-motion: no transforms, no loops — opacity only.
 */

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.55, 0, 1, 0.45],
};

export const dur = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  reveal: 0.8,
  hero: 1.1,
};

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 22, mass: 0.6 },
  snappy: { type: 'spring', stiffness: 380, damping: 32 },
  pointer: { stiffness: 60, damping: 18, mass: 0.8 },
};

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
};

/** Fade-and-rise. Use for blocks of content entering the viewport. */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur.slow, ease: ease.out } },
};

export const staggerChildren = (each = stagger.base, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: each, delayChildren } },
});

/** Shared viewport config for scroll reveals: fire once, slightly before fully in view. */
export const inViewOnce = { once: true, amount: 0.25, margin: '0px 0px -8% 0px' };
