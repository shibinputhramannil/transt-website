import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * CoreKnowledge — documents to a cited answer.
 * Still: a stack of documents with two passages marked, an answer that quotes them, and its
 * citations S1 and S2.
 * Story: a search line scans the page, the two passages are marked, they connect to the answer,
 * the answer is written out and the citations appear. (Today's answers quote the documents
 * directly, hence the quotation mark; no AI-written text is implied.)
 */
const PAGE_LINES = [
  [62, 44],
  [70, 40],
  [78, 46],
  [86, 30],
  [94, 42],
  [102, 38],
  [110, 44],
  [118, 26],
];
const ANSWER_LINES = ['M134 74 H168', 'M122 85 H168', 'M122 95 H162', 'M122 105 H150'];

export default function KnowledgeScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      {/* the document stack */}
      <rect x="40" y="36" width="58" height="76" rx="6" className={s.panel} />
      <rect x="33" y="43" width="58" height="76" rx="6" className={s.panel} />
      <rect x="26" y="50" width="58" height="78" rx="6" className={s.card} />

      {/* the passages that answer the question */}
      <motion.rect
        x="30"
        y="65"
        width="50"
        height="18"
        rx="4"
        className={s.highlight}
        {...cue(active, { opacity: { idle: 1, points: [[0.55, 0], [0.8, 1]] } })}
      />
      <motion.rect
        x="30"
        y="97.5"
        width="44"
        height="9"
        rx="3"
        className={s.highlight}
        {...cue(active, { opacity: { idle: 1, points: [[0.85, 0], [1.1, 1]] } })}
      />
      {PAGE_LINES.map(([y, w]) => (
        <path key={y} d={`M33 ${y} H${33 + w}`} className={s.lineSoft} />
      ))}

      {/* search line scanning the page */}
      <motion.path
        d="M29 56 H81"
        className={s.scan}
        {...cue(active, {
          y: { idle: 0, points: [[0.05, 0], [1.1, 68]] },
          opacity: { idle: 0, points: [[0.05, 0], [0.2, 1], [0.95, 1], [1.15, 0]] },
        })}
      />

      {/* passages → answer */}
      <motion.path
        d="M80 74 C96 74, 102 84, 114 86"
        className={s.link}
        {...cue(active, { pathLength: { idle: 1, points: [[1.2, 0], [1.6, 1]] } })}
      />
      <motion.path
        d="M74 102 C92 102, 100 98, 114 96"
        className={s.link}
        {...cue(active, { pathLength: { idle: 1, points: [[1.3, 0], [1.7, 1]] } })}
      />

      {/* the answer */}
      <rect x="114" y="60" width="64" height="56" rx="11" className={s.card} />
      <path d="M128 115 L122 126 L138 115" className={s.card} />
      <text x="119" y="83" className={s.quote}>
        “
      </text>
      {ANSWER_LINES.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          className={s.lineSoft}
          {...cue(active, {
            pathLength: { idle: 1, points: [[1.75 + i * 0.12, 0], [2.05 + i * 0.12, 1]] },
            opacity: { idle: 1, points: [[1.75 + i * 0.12, 0], [1.8 + i * 0.12, 1]] },
          })}
        />
      ))}

      {/* citations */}
      {['S1', 'S2'].map((label, i) => (
        <motion.g
          key={label}
          {...cue(active, { scale: { idle: 1, points: [[2.45 + i * 0.15, 0], [2.7 + i * 0.15, 1.12], [2.85 + i * 0.15, 1]] } })}
        >
          <rect x={116 + i * 28} y="132" width="24" height="14" rx="7" className={s.soft} />
          <text x={128 + i * 28} y="141.8" className={s.label}>
            {label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
