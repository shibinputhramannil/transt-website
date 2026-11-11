import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * TRANST Kitchen OS — delivery orders on shared equipment.
 * Still: three equipment lanes (oven, fryer, stove) with prep tasks, and two pickup flags.
 * Story: tasks slide into the schedule; the order whose pickup comes first turns peach (at risk);
 * "Do next" lifts it ahead of the other oven task, so it is ready before its pickup, and it settles.
 */
const LANES = [74, 106, 138];

const TASKS = [
  { id: 'a', lane: 0, x: 62, w: 26, swap: 50 },
  { id: 'b', lane: 0, x: 92, w: 46, swap: -30, risk: true },
  { id: 'c', lane: 1, x: 60, w: 30 },
  { id: 'e', lane: 1, x: 96, w: 24 },
  { id: 'd', lane: 2, x: 70, w: 44 },
  { id: 'f', lane: 2, x: 120, w: 32 },
];

const RISK = [[1.0, 0], [1.3, 1], [2.4, 1], [2.75, 0]];

function Equipment({ lane, cy }) {
  return (
    <g>
      <rect x="18" y={cy - 11} width="24" height="22" rx="6" className={s.panel} />
      <g className={s.icon}>
        {lane === 0 && (
          <>
            <rect x="23.5" y={cy - 6} width="13" height="12" rx="2" />
            <rect x="26.5" y={cy - 2.5} width="7" height="5.5" rx="1" />
          </>
        )}
        {lane === 1 && (
          <>
            <path d={`M23.5 ${cy - 4} H36.5 L34.5 ${cy + 5} H25.5 Z`} />
            <path d={`M36.5 ${cy - 4} L39.5 ${cy - 7.5}`} />
          </>
        )}
        {lane === 2 && (
          <>
            <circle cx="30" cy={cy} r="6" />
            <circle cx="30" cy={cy} r="2.4" />
          </>
        )}
      </g>
    </g>
  );
}

function Flag({ x, className }) {
  return (
    <g className={className}>
      <path d={`M${x} 47 V62`} />
      <path d={`M${x} 47 l8 3 l-8 3 Z`} />
    </g>
  );
}

export default function KitchenOsScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      {/* clock */}
      <circle cx="30" cy="42" r="9" className={s.card} />
      <path d="M30 42 H34" className={s.stroke} />
      <motion.g {...cue(active, { rotate: { idle: 0, points: [[0.1, 0], [3.0, 180]] } })}>
        <circle cx="30" cy="42" r="9" fill="none" />
        <path d="M30 42 V36" className={s.stroke} />
      </motion.g>

      {/* pickup times: the at-risk order's flag, and a later one */}
      <Flag x={128} className={s.flag} />
      <motion.g {...cue(active, { opacity: { idle: 0, points: RISK } })}>
        <Flag x={128} className={s.flagRisk} />
      </motion.g>
      <Flag x={172} className={s.flag} />

      {LANES.map((cy, lane) => (
        <g key={cy}>
          <Equipment lane={lane} cy={cy} />
          <rect x="54" y={cy - 11} width="126" height="22" rx="7" className={s.panel} />
        </g>
      ))}

      {TASKS.map((t, i) => {
        const y = LANES[t.lane] - 7;
        const start = 0.05 + i * 0.08;
        const x = t.swap
          ? [[start, 26], [start + 0.5, 0], [t.risk ? 2.05 : 2.1, 0], [t.risk ? 2.45 : 2.5, t.swap]]
          : [[start, 26], [start + 0.5, 0]];
        const lift = t.risk ? { y: { idle: 0, points: [[1.85, 0], [2.05, -10], [2.45, -10], [2.65, 0]] } } : {};
        return (
          <motion.g
            key={t.id}
            {...cue(active, {
              x: { idle: 0, points: x },
              opacity: { idle: 1, points: [[start, 0], [start + 0.4, 1]] },
              ...lift,
            })}
          >
            <rect x={t.x} y={y} width={t.w} height="14" rx="4" className={s.soft} />
            {t.risk && (
              <motion.rect
                x={t.x}
                y={y}
                width={t.w}
                height="14"
                rx="4"
                className={s.warm}
                {...cue(active, { opacity: { idle: 0, points: RISK } })}
              />
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
