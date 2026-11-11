import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * TRANST ERP — sales to cash.
 * Still: the four stages of a sale around a cycle, with the ledger in the middle.
 * Story: a dot travels Lead → Order → Invoice → Payment, lighting each stage; then the debit and
 * credit bars in the ledger rise to the same height and a level line shows the books balance.
 */
const STAGES = [
  { id: 'lead', x: 100, y: 38 },
  { id: 'order', x: 162, y: 100 },
  { id: 'invoice', x: 100, y: 162 },
  { id: 'payment', x: 38, y: 100 },
];
const STEP = 0.7;
const at = (i) => 0.15 + i * STEP; // when the dot reaches stage i

function Icon({ id, x, y }) {
  if (id === 'lead') {
    return (
      <>
        <circle cx={x} cy={y - 3.5} r="3" />
        <path d={`M${x - 6.5} ${y + 6.5} Q${x} ${y - 0.5} ${x + 6.5} ${y + 6.5}`} />
      </>
    );
  }
  if (id === 'order') {
    return (
      <>
        <rect x={x - 6} y={y - 5} width="12" height="10" rx="1.5" />
        <path d={`M${x - 6} ${y - 1.5} H${x + 6} M${x} ${y - 5} V${y - 1.5}`} />
      </>
    );
  }
  if (id === 'invoice') {
    return (
      <>
        <rect x={x - 4.5} y={y - 6.5} width="9" height="13" rx="1.2" />
        <path d={`M${x - 2.5} ${y - 3} H${x + 2.5} M${x - 2.5} ${y} H${x + 2.5} M${x - 2.5} ${y + 3} H${x + 1}`} />
      </>
    );
  }
  return (
    <>
      <circle cx={x} cy={y} r="6.5" />
      <path d={`M${x - 3} ${y + 0.3} l2.2 2.2 l4 -4.4`} />
    </>
  );
}

export default function ErpScene({ active }) {
  const done = at(3);
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      <circle cx="100" cy="100" r="62" className={s.dash} />

      {/* progress around the cycle */}
      <motion.path
        d="M100 38 A62 62 0 1 1 38 100"
        className={s.trail}
        {...cue(active, {
          pathLength: { idle: 0, points: [[at(0), 0], [at(1), 1 / 3], [at(2), 2 / 3], [at(3), 1]] },
          opacity: { idle: 0, points: [[0, 1]] },
        })}
      />

      {/* the travelling dot (drawn under the stages, so it enters each one) */}
      <motion.g
        {...cue(active, {
          rotate: { idle: 0, points: [[at(0), 0], [at(1), 90], [at(2), 180], [at(3), 270]] },
          opacity: { idle: 0, points: [[0, 1]] },
        })}
      >
        <circle cx="100" cy="100" r="62" fill="none" />
        <circle cx="100" cy="38" r="4.5" className={s.dot} />
      </motion.g>

      {STAGES.map((n, i) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="13" className={s.node} />
          <g className={s.icon}>
            <Icon id={n.id} x={n.x} y={n.y} />
          </g>
          <motion.g {...cue(active, { opacity: { idle: 0, points: [[at(i), 0], [at(i) + 0.25, 1]] } })}>
            <circle cx={n.x} cy={n.y} r="13" className={s.nodeOn} />
            <g className={s.iconOn}>
              <Icon id={n.id} x={n.x} y={n.y} />
            </g>
          </motion.g>
        </g>
      ))}

      {/* the ledger: debits and credits */}
      <rect x="70" y="74" width="60" height="52" rx="7" className={s.panel} />
      <path d="M77 82 H123" className={s.hair} />
      <path d="M100 88 V120" className={s.hair} />
      <motion.path
        d="M88 120 V92"
        className={s.barForest}
        style={{ strokeWidth: 11 }}
        {...cue(active, { pathLength: { idle: 0.42, points: [[done + 0.1, 0.42], [done + 0.7, 1]] } })}
      />
      <motion.path
        d="M112 120 V92"
        className={s.barPeach}
        style={{ strokeWidth: 11 }}
        {...cue(active, { pathLength: { idle: 0.42, points: [[done + 0.3, 0.42], [done + 0.9, 1]] } })}
      />
      <motion.path
        d="M80 88 H120"
        className={s.level}
        {...cue(active, {
          pathLength: { idle: 0, points: [[done + 1.0, 0], [done + 1.35, 1]] },
          opacity: { idle: 0, points: [[done + 1.0, 0], [done + 1.05, 1]] },
        })}
      />
    </svg>
  );
}
