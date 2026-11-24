import { motion } from 'framer-motion';
import { cue } from './timeline.js';
import s from './ProductArt.module.css';

/**
 * TRANST Agent Control Tower — every tool call goes through the policy engine.
 * Still: an agent, the policy gate, an allowed tool, an approval card, a blocked tool, and the
 * audit log with one line per decision.
 * Story: the agent sends three tool calls. The first is allowed and reaches its tool. The second
 * is high-risk, so it waits (peach) until a person approves it. The third uses a tool the agent
 * was never given, so it is blocked. Each decision is written to the audit log.
 */
const LINEAR = 'linear';
const packet = (start, gateAt, endAt, dx, dy) => ({
  x: { idle: 0, points: [[start, 0], [gateAt, 51], [endAt, dx]], ease: LINEAR },
  y: { idle: 0, points: [[start, 0], [gateAt, 0], [endAt, dy]], ease: LINEAR },
  opacity: { idle: 0, points: [[start, 0], [start + 0.05, 1], [endAt, 1], [endAt + 0.15, 0]] },
});
const HELD = [[1.6, 0], [1.7, 1], [2.15, 1], [2.3, 0]];
const AUDIT = [
  { y: 157, at: 1.05, warm: false, w: 96 },
  { y: 165, at: 2.35, warm: false, w: 84 },
  { y: 173, at: 2.9, warm: true, w: 72 },
];

export default function ControlTowerScene({ active }) {
  return (
    <svg viewBox="0 0 200 200" className={s.svg} aria-hidden="true" focusable="false">
      <g transform="translate(0 -12)">
        {/* lanes: agent → policy gate → allowed tool / approval / blocked tool */}
        <path d="M49 100 H86" className={s.hair} />
        <path d="M108 93 L147 63" className={s.hair} />
        <path d="M114 100 H143" className={s.hair} />
        <path d="M109 109 L122 122" className={s.hair} />
        <rect x="146" y="126" width="32" height="20" rx="5" className={s.dash} />

        {/* the agent */}
        <path d="M34 85 V80" className={s.stroke} />
        <circle cx="34" cy="78" r="2.2" className={s.forest} />
        <circle cx="34" cy="100" r="15" className={s.forest} />
        <circle cx="29" cy="98" r="2" className={s.creamFill} />
        <circle cx="39" cy="98" r="2" className={s.creamFill} />
        <path d="M30 104.5 H38" className={s.creamMark} />

        {/* the policy engine */}
        <rect x="88" y="88" width="24" height="24" rx="5" transform="rotate(45 100 100)" className={s.card} />
        <path d="M95 96 H105 M95 100 H105 M95 104 H102" className={s.link} />

        {/* allowed tool */}
        <rect x="148" y="52" width="32" height="21" rx="5" className={s.card} />
        <path d="M153 59 H165 M153 65 H161" className={s.link} />
        <motion.path
          d="M167.5 62.5 l2.2 2.2 l4 -4.4"
          className={s.stroke}
          style={{ strokeWidth: 1.8 }}
          {...cue(active, { opacity: { idle: 1, points: [[1.0, 0], [1.15, 1]] } })}
        />

        {/* approval card: high-risk calls wait for a person */}
        <rect x="144" y="89" width="38" height="22" rx="6" className={s.card} />
        <motion.rect x="144" y="89" width="38" height="22" rx="6" className={s.warm} {...cue(active, { opacity: { idle: 0, points: HELD } })} />
        <path d="M150 97 H164 M150 103 H159" className={s.link} />
        <motion.text x="172" y="103" className={s.label} {...cue(active, { opacity: { idle: 0, points: HELD } })}>
          ?
        </motion.text>
        <motion.path
          d="M168.5 100.5 l2.2 2.2 l4 -4.4"
          className={s.stroke}
          style={{ strokeWidth: 1.8 }}
          {...cue(active, { opacity: { idle: 1, points: [[2.2, 0], [2.35, 1]] } })}
        />

        {/* blocked: a tool the agent was never given */}
        <motion.path
          d="M124.5 124.5 l7 7 M131.5 124.5 l-7 7"
          className={s.level}
          style={{ strokeWidth: 2.2 }}
          {...cue(active, { opacity: { idle: 1, points: [[2.8, 0], [2.9, 1]] } })}
        />

        {/* the three tool calls */}
        <motion.circle cx="49" cy="100" r="4" className={s.dot} {...cue(active, packet(0.1, 0.5, 0.95, 99, -38))} />
        <motion.circle cx="49" cy="100" r="4" className={s.dot} {...cue(active, packet(0.95, 1.35, 1.6, 95, 0))} />
        <motion.circle cx="49" cy="100" r="4" className={s.dot} {...cue(active, packet(2.2, 2.55, 2.8, 75, 24))} />

        {/* the person approving */}
        <motion.g
          {...cue(active, {
            x: { idle: 0, points: [[1.7, 16], [2.0, 0]] },
            y: { idle: 0, points: [[1.7, 26], [2.0, 0]] },
            opacity: { idle: 0, points: [[1.7, 0], [1.8, 1], [2.35, 1], [2.5, 0]] },
            scale: { idle: 1, points: [[2.05, 1], [2.12, 0.82], [2.25, 1]] },
          })}
        >
          <path d="M172 104 L172 116 L175.2 113 L177.6 118 L179.4 117.2 L177 112.4 L181.5 112.4 Z" className={s.card} />
        </motion.g>

        {/* the audit log: one line per decision */}
        <rect x="30" y="148" width="148" height="34" rx="6" className={s.panel} />
        {AUDIT.map((row) => (
          <g key={row.y}>
            <motion.circle
              cx="40"
              cy={row.y}
              r="2.4"
              className={row.warm ? s.dotWarm : s.dotSoft}
              {...cue(active, { opacity: { idle: 1, points: [[row.at, 0], [row.at + 0.1, 1]] } })}
            />
            <motion.path
              d={`M47 ${row.y} H${47 + row.w}`}
              className={s.link}
              {...cue(active, { pathLength: { idle: 1, points: [[row.at, 0], [row.at + 0.3, 1]] } })}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
