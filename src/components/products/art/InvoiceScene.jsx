import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * TRANST Invoice Intake — invoices read for you, checked by you.
 * Still: an invoice beside its extracted fields, all checked, the invoice approved and its CSV
 * export ready.
 * Story: a scan line reads the invoice and the fields fill in; the date is uncertain, so it is
 * flagged and waits; a person clicks to confirm it; then the invoice is approved and exported.
 * (Rule-based reading in the demo; nothing suggests AI, and nothing is approved without a person.)
 */
const ROWS = [54, 72, 90, 108];
const FLAGGED = 2; // the date: ambiguous dates are never guessed
const fill = (i) => 0.35 + i * 0.2;
const FLAG = [[0.95, 0], [1.1, 1], [1.85, 1], [2.05, 0]];

const tick = (y) => `M166.5 ${y} l2.2 2.2 l4 -4.4`;

export default function InvoiceScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      {/* the invoice */}
      <rect x="22" y="40" width="66" height="88" rx="5" className={s.card} />
      <path d="M30 52 H60" className={s.stroke} />
      <path d="M30 62 H54 M30 68 H48 M30 82 H80 M30 89 H76 M30 96 H80" className={s.link} />
      <path d="M30 104 H80" className={s.hair} />
      <path d="M30 114 H48" className={s.link} />
      <path d="M62 114 H80" className={s.stroke} />

      {/* reading it */}
      <motion.path
        d="M26 46 H84"
        className={s.scan}
        {...cue(active, {
          y: { idle: 0, points: [[0.1, 0], [1.0, 76]] },
          opacity: { idle: 0, points: [[0.1, 0], [0.2, 1], [0.85, 1], [1.05, 0]] },
        })}
      />
      <path d="M90 84 H98" className={s.link} />
      <path d="M95 81 L99 84 L95 87" className={s.link} />

      {/* the extracted fields */}
      <rect x="100" y="42" width="80" height="78" rx="6" className={s.panel} />
      {ROWS.map((y, i) => (
        <g key={y}>
          <path d={`M107 ${y} H121`} className={s.link} />
          <rect x="125" y={y - 5} width="38" height="10" rx="3" className={s.panel} />
          {i === FLAGGED && (
            <motion.rect
              x="125"
              y={y - 5}
              width="38"
              height="10"
              rx="3"
              className={s.warm}
              {...cue(active, { opacity: { idle: 0, points: FLAG } })}
            />
          )}
          <motion.path
            d={`M129 ${y} H${i === FLAGGED ? 149 : i % 2 ? 151 : 157}`}
            className={s.lineSoft}
            style={{ strokeWidth: 2.2 }}
            {...cue(active, {
              pathLength: { idle: 1, points: [[fill(i), 0], [fill(i) + 0.25, 1]] },
              opacity: { idle: 1, points: [[fill(i), 0], [fill(i) + 0.03, 1]] },
            })}
          />
          {i === FLAGGED && (
            <motion.text x="158" y={y + 3} className={s.label} {...cue(active, { opacity: { idle: 0, points: FLAG } })}>
              ?
            </motion.text>
          )}
          <motion.path
            d={tick(y)}
            className={s.stroke}
            style={{ strokeWidth: 1.8 }}
            {...cue(active, {
              opacity: {
                idle: 1,
                points: i === FLAGGED ? [[1.95, 0], [2.1, 1]] : [[fill(i) + 0.25, 0], [fill(i) + 0.35, 1]],
              },
            })}
          />
        </g>
      ))}

      {/* a person confirms the flagged value */}
      <motion.g
        {...cue(active, {
          x: { idle: 0, points: [[1.3, 16], [1.7, 0]] },
          y: { idle: 0, points: [[1.3, 34], [1.7, 0]] },
          opacity: { idle: 0, points: [[1.3, 0], [1.45, 1], [2.2, 1], [2.4, 0]] },
          scale: { idle: 1, points: [[1.75, 1], [1.82, 0.82], [1.95, 1]] },
        })}
      >
        <path d="M171 93 L171 105 L174.2 102 L176.6 107 L178.4 106.2 L176 101.4 L180.5 101.4 Z" className={s.card} />
      </motion.g>

      {/* approved, then exported */}
      <motion.g {...cue(active, { scale: { idle: 1, points: [[2.3, 0], [2.5, 1.1], [2.62, 1]] } })}>
        <rect x="102" y="131" width="58" height="15" rx="7.5" className={s.forest} />
        <text x="131" y="141.2" className={s.labelOn}>
          APPROVED
        </text>
      </motion.g>
      <motion.g
        {...cue(active, {
          x: { idle: 0, points: [[2.65, -14], [3.05, 0]] },
          opacity: { idle: 1, points: [[2.65, 0], [2.9, 1]] },
        })}
      >
        <rect x="166" y="128" width="17" height="21" rx="2.5" className={s.card} />
        <path d="M166 135 H183 M166 142 H183 M174.5 128 V149" className={s.link} />
      </motion.g>
    </svg>
  );
}
