import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * KitchenMind AI — prep from sales.
 * Still: sales on the same weekday over recent weeks, their average, tomorrow's forecast with a
 * buffer on top, and stock batches lined up by expiry date.
 * Story: the past bars redraw, the average line runs across them, the forecast grows to the
 * average and gets its buffer; then the batch that expires first is used and the others move up.
 */
const BASE = 126;
const PAST = [
  { x: 44, h: 44 },
  { x: 66, h: 58 },
  { x: 88, h: 50 },
  { x: 110, h: 56 },
];
const AVG_Y = BASE - 52; // the average of the four bars
const BATCHES = [40, 82, 124];

export default function KitchenMindScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      <path d={`M30 ${BASE} H178`} className={s.hair} />

      {PAST.map((b, i) => (
        <motion.path
          key={b.x}
          d={`M${b.x} ${BASE} V${BASE - b.h}`}
          className={s.barSoft}
          style={{ strokeWidth: 13 }}
          {...cue(active, { pathLength: { idle: 1, points: [[0.05 + i * 0.08, 0], [0.5 + i * 0.08, 1]] } })}
        />
      ))}

      {/* the average, carried across to tomorrow */}
      <motion.path
        d={`M34 ${AVG_Y} H162`}
        className={s.level}
        {...cue(active, {
          pathLength: { idle: 1, points: [[0.7, 0], [1.2, 1]] },
          opacity: { idle: 1, points: [[0.7, 0], [0.75, 1]] },
        })}
      />

      {/* tomorrow: forecast plus buffer */}
      <path d={`M140 ${BASE} V${AVG_Y - 6} H156 V${BASE}`} className={s.dash} />
      <motion.path
        d={`M148 ${BASE} V${AVG_Y}`}
        className={s.barForest}
        style={{ strokeWidth: 16 }}
        {...cue(active, { pathLength: { idle: 1, points: [[1.25, 0], [1.85, 1]] } })}
      />
      <motion.path
        d={`M148 ${AVG_Y} V${AVG_Y - 6}`}
        className={s.barPeach}
        style={{ strokeWidth: 16 }}
        {...cue(active, { pathLength: { idle: 1, points: [[1.95, 0], [2.25, 1]] } })}
      />

      {/* stock batches, earliest expiry first */}
      {BATCHES.map((x, i) => {
        const move =
          i === 0
            ? { y: { idle: 0, points: [[2.45, 0], [2.85, -12]] }, opacity: { idle: 1, points: [[2.45, 1], [2.85, 0]] } }
            : { x: { idle: 0, points: [[2.75, 0], [3.2, -42]] } };
        return (
          <motion.g key={x} {...cue(active, move)}>
            <rect x={x} y="142" width="34" height="20" rx="5" className={s.panel} />
            <path d={`M${x + 7} 149 H${x + 19} M${x + 7} 155 H${x + 15}`} className={s.link} />
            <circle cx={x + 27} cy="152" r="3.2" className={i === 0 ? s.dotWarm : s.dotSoft} />
          </motion.g>
        );
      })}
    </svg>
  );
}
