import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * GoFree — a bus coming to your stop, shown honestly.
 * Still: a road with its stops, your stop with the time until the bus arrives, and a bus drawn
 * dashed: a scheduled estimate worked out from the timetable, never called live.
 * Story: a passenger on the bus starts sharing GPS (ripples); the bus becomes solid and LIVE and
 * drives toward your stop, the arrival time drops, and the stop's alert bell rings.
 */
const ROAD = 'M18 150 H58 Q66 150 71 144 L91 118 Q96 112 104 112 H122 Q130 112 135 106 L151 80 Q156 74 164 74 H184';
const TRAIL = 'M58 150 Q66 150 71 144 L91 118 Q96 112 104 112 H122 Q130 112 135 106 L151 80 Q154 76 156 76';

// The bus drives from (58,150) toward your stop; times are spread by distance so it moves steadily.
const DRIVE = { from: 1.0, to: 2.6 };
const STOPS = [
  [0, 0, 0],
  [0.08, 10, -3],
  [0.373, 34, -33],
  [0.473, 46, -38],
  [0.626, 66, -38],
  [0.736, 78, -46],
  [0.935, 92, -68],
  [1, 98, -74],
];
const at = (f) => DRIVE.from + f * (DRIVE.to - DRIVE.from);
const drive = (i) => STOPS.map((p) => [at(p[0]), p[i]]);

function Bus({ live }) {
  return (
    <>
      <rect x="46.5" y="141.5" width="23" height="17" rx="4.5" className={live ? s.forest : s.cardDashed} />
      <path d="M51 147 H65" className={live ? s.creamMark : s.stroke} />
      <circle cx="52.5" cy="154" r="1.6" className={live ? s.creamFill : s.forest} />
      <circle cx="63.5" cy="154" r="1.6" className={live ? s.creamFill : s.forest} />
    </>
  );
}

export default function GoFreeScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      {/* the road and the part the bus has covered */}
      <path d={ROAD} className={s.roadEdge} />
      <path d={ROAD} className={s.road} />
      <motion.path
        d={TRAIL}
        className={s.trail}
        {...cue(active, {
          pathLength: { idle: 0, points: [[DRIVE.from, 0], [DRIVE.to, 1]], ease: 'linear' },
          opacity: { idle: 0, points: [[DRIVE.from, 0], [DRIVE.from + 0.05, 1]] },
        })}
      />

      {/* stops; yours is ringed */}
      <circle cx="36" cy="150" r="3.6" className={s.node} />
      <circle cx="113" cy="112" r="3.6" className={s.node} />
      <circle cx="172" cy="74" r="6.5" className={s.node} />
      <circle cx="172" cy="74" r="3" className={s.dotWarm} />

      {/* time until the bus reaches your stop */}
      <path d="M172 57 V67" className={s.hair} />
      <rect x="140" y="42" width="40" height="15" rx="7.5" className={s.soft} />
      <motion.text x="160" y="52.6" className={s.label} {...cue(active, { opacity: { idle: 1, points: [[1.8, 1], [2.05, 0]] } })}>
        6 min
      </motion.text>
      <motion.text x="160" y="52.6" className={s.label} {...cue(active, { opacity: { idle: 0, points: [[1.8, 0], [2.05, 1]] } })}>
        2 min
      </motion.text>

      {/* the stop alert */}
      <motion.g
        {...cue(active, {
          rotate: { idle: 0, points: [[2.55, 0], [2.65, 16], [2.75, -14], [2.85, 10], [2.95, -6], [3.05, 0]] },
        })}
      >
        <path d="M183.5 51 C183.5 44.5 186 41.5 189 41.5 C192 41.5 194.5 44.5 194.5 51 Z" className={s.card} />
        <path d="M182.5 51 H195.5" className={s.stroke} />
        <circle cx="189" cy="53.4" r="1.4" className={s.forest} />
      </motion.g>

      {/* a passenger on the bus starts sharing GPS */}
      {[0, 0.3].map((d) => (
        <motion.circle
          key={d}
          cx="58"
          cy="150"
          r="11"
          className={s.scan}
          {...cue(active, {
            scale: { idle: 1, points: [[0.15 + d, 0.4], [0.75 + d, 1.8]] },
            opacity: { idle: 0, points: [[0.15 + d, 0.9], [0.75 + d, 0]] },
          })}
        />
      ))}

      {/* the bus: a dashed scheduled estimate until real GPS arrives, then LIVE */}
      <motion.g {...cue(active, { x: { idle: 0, points: drive(1), ease: 'linear' }, y: { idle: 0, points: drive(2), ease: 'linear' } })}>
        <motion.g {...cue(active, { opacity: { idle: 1, points: [[0.85, 1], [1.0, 0]] } })}>
          <Bus live={false} />
        </motion.g>
        <motion.g {...cue(active, { opacity: { idle: 0, points: [[0.85, 0], [1.0, 1]] } })}>
          <Bus live />
          <rect x="44" y="162" width="28" height="13" rx="6.5" className={s.forest} />
          <text x="58" y="171.2" className={s.labelOn}>
            LIVE
          </text>
        </motion.g>
      </motion.g>
    </svg>
  );
}
