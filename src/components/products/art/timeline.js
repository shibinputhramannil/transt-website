import { ease } from '../../../motion/tokens.js';

const BACK = { duration: 0.35, ease: ease.out };

/**
 * Motion props for one SVG element of a product scene.
 *
 * Every property has an `idle` value (the still picture) and `points`: [seconds, value] pairs on the
 * scene's own timeline. Each time the scene becomes active the timeline plays from 0: a property
 * jumps to its first value at once, holds it until that point's time, then moves through the rest.
 * When the scene goes idle again, everything eases back to its idle value.
 *
 *   <motion.path {...cue(active, { pathLength: { idle: 1, points: [[0.4, 0], [1.0, 1]] } })} />
 */
export function cue(active, props) {
  const animate = {};
  const transition = {};
  for (const [key, { idle, points }] of Object.entries(props)) {
    if (!active || !points?.length) {
      animate[key] = idle;
      transition[key] = BACK;
      continue;
    }
    const end = Math.max(points[points.length - 1][0], 0.01);
    const timed = points[0][0] > 0 ? [[0, points[0][1]], ...points] : points;
    animate[key] = timed.map(([, v]) => v);
    transition[key] = { duration: end, times: timed.map(([t]) => t / end), ease: ease.inOut };
  }
  return { initial: false, animate, transition };
}
