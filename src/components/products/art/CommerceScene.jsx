import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * TRANST E-Commerce — cart to order.
 * Still: a product with its stock level, the cart, and an order receipt.
 * Story: the product drops into the cart; the order is placed, so stock goes from 3 to 2 and the
 * receipt prints with a tick. (No payment step: the store does not take payments.)
 */
function Bottle({ x, y, scale = 1 }) {
  // x, y: centre of the bottle body
  const w = 17 * scale;
  const h = 24 * scale;
  return (
    <>
      <rect x={x - 3.5 * scale} y={y - h / 2 - 5 * scale} width={7 * scale} height={5 * scale} rx={1.5 * scale} className={s.card} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4.5 * scale} className={s.card} />
      <path d={`M${x - 5 * scale} ${y - 1} H${x + 5 * scale} M${x - 5 * scale} ${y + 3.5 * scale} H${x + 2 * scale}`} className={s.link} />
    </>
  );
}

const RECEIPT_LINES = ['M157 53 H179', 'M157 60 H174', 'M157 67 H177'];

export default function CommerceScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      {/* product and its stock */}
      <rect x="24" y="30" width="48" height="48" rx="9" className={s.panel} />
      <Bottle x={48} y={57} />
      <rect x="80" y="31" width="44" height="16" rx="8" className={s.soft} />
      <motion.text x="102" y="42" className={s.label} {...cue(active, { opacity: { idle: 1, points: [[1.6, 1], [1.85, 0]] } })}>
        3 left
      </motion.text>
      <motion.text x="102" y="42" className={s.label} {...cue(active, { opacity: { idle: 0, points: [[1.6, 0], [1.85, 1]] } })}>
        2 left
      </motion.text>

      {/* flow: product → cart → receipt */}
      <path d="M74 60 C96 60, 104 74, 106 98" className={s.dash} />
      <path d="M152 108 C162 104, 166 100, 167 94" className={s.dash} />

      {/* cart (dips when the product lands) */}
      <motion.g {...cue(active, { y: { idle: 0, points: [[1.0, 0], [1.15, 4], [1.4, 0]] } })}>
        <motion.g
          {...cue(active, {
            x: { idle: 0, points: [[0.15, -62], [0.55, -34], [1.0, 0]] },
            y: { idle: 0, points: [[0.15, -55], [0.55, -72], [1.0, 0]] },
            opacity: { idle: 0, points: [[0.15, 0], [0.3, 1]] },
          })}
        >
          <Bottle x={110} y={112} scale={0.8} />
        </motion.g>
        <path d="M70 108 H150 L142 142 H80 Z" className={s.card} />
        <path d="M70 108 L64 96 H54" className={s.stroke} />
        <path d="M77 119 H147 M79 131 H144" className={s.link} />
        <circle cx="90" cy="151" r="5" className={s.card} />
        <circle cx="134" cy="151" r="5" className={s.card} />
      </motion.g>

      {/* order receipt */}
      <motion.g
        {...cue(active, {
          y: { idle: 0, points: [[1.6, -8], [2.0, 0]] },
          opacity: { idle: 1, points: [[1.6, 0], [1.95, 1]] },
        })}
      >
        <rect x="150" y="42" width="36" height="50" rx="4" className={s.card} />
        {RECEIPT_LINES.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            className={s.link}
            {...cue(active, { pathLength: { idle: 1, points: [[2.0 + i * 0.12, 0], [2.3 + i * 0.12, 1]] } })}
          />
        ))}
        <path d="M157 79 H179" className={s.stroke} />
      </motion.g>
      <motion.g {...cue(active, { scale: { idle: 1, points: [[2.55, 0], [2.8, 1.15], [2.95, 1]] } })}>
        <circle cx="184" cy="91" r="7.5" className={s.forest} />
        <path d="M180.5 91.3 l2.3 2.3 l4.2 -4.6" className={s.creamMark} />
      </motion.g>
    </svg>
  );
}
