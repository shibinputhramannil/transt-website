import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ease } from '../../motion/tokens.js';
import styles from './ServiceDiagram.module.css';

/**
 * Animated technical diagrams for each service line.
 * type: 'stack' | 'pipeline' | 'agent' | 'webapp' | 'bridge'
 * Draws in once when visible; slow ambient loops run only while on screen
 * (and, when the `active` prop is given, only while it is true).
 */
export default function ServiceDiagram({ type, tone = 'light', className = '', title, active }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const visible = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion();
  // `active` (optional) lets a parent gate the ambient loop, e.g. to hover/focus; default: whenever visible.
  const ctx = { play: seen, live: (active ?? true) && visible && seen && !reduce, reduce };
  const Diagram = DIAGRAMS[type] ?? Stack;

  return (
    <div ref={ref} className={`${styles.wrap} ${styles[tone]} ${className}`} role="img" aria-label={title ?? LABELS[type]}>
      <svg viewBox="0 0 320 220" className={styles.svg} aria-hidden="true">
        <Diagram {...ctx} />
      </svg>
    </div>
  );
}

const LABELS = {
  stack: 'Diagram: an interface, application logic and AI model layered into one product.',
  pipeline: 'Diagram: a workflow that ingests, understands, decides and acts, with a human review branch.',
  agent: 'Diagram: an AI agent looping through plan, act and observe while calling tools.',
  webapp: 'Diagram: a web application interface assembling from components.',
  bridge: 'Diagram: existing systems connected to AI services through a guarded integration layer.',
};

/* ---- shared helpers ---------------------------------------------------- */

const drawIn = (play, reduce, delay = 0, duration = 0.9) =>
  reduce
    ? { initial: false }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: play ? { pathLength: 1, opacity: 1 } : {},
        transition: { pathLength: { duration, ease: ease.inOut, delay }, opacity: { duration: 0.2, delay } },
      };

const popIn = (play, reduce, delay = 0) =>
  reduce
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 8 },
        animate: play ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.6, ease: ease.out, delay },
      };

/** A short dash that travels along `d`. */
function Packet({ d, live, delay = 0, duration = 1.8, repeatDelay = 1.2, warm = false, reverse = false }) {
  if (!live) return null;
  return (
    <motion.path
      d={d}
      pathLength="1"
      className={warm ? styles.packetWarm : styles.packet}
      strokeDasharray="0.1 1.2"
      initial={{ strokeDashoffset: reverse ? -1 : 0.1 }}
      animate={{ strokeDashoffset: reverse ? 0.1 : -1 }}
      transition={{ duration, ease: 'easeInOut', delay, repeat: Infinity, repeatDelay }}
    />
  );
}

/** Cycles an index while `live` — used to move a highlight between parts of a diagram. */
function useCycle(count, live, ms = 2200) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!live) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => clearInterval(t);
  }, [count, live, ms]);
  return i;
}

/* ---- 01 Stack: interface / logic / model ------------------------------- */

function Stack({ play, live, reduce }) {
  const layers = [
    { y: 34, label: 'INTERFACE' },
    { y: 92, label: 'LOGIC' },
    { y: 150, label: 'MODEL + DATA' },
  ];
  const active = useCycle(3, live, 1800);
  const plane = (y) => `M 36 ${y + 18} L 126 ${y} L 216 ${y + 18} L 126 ${y + 36} Z`;
  return (
    <>
      <motion.path d="M126 70 L126 168" className={styles.rail} {...drawIn(play, reduce, 0.6)} />
      {layers
        .slice()
        .reverse()
        .map((l, ri) => {
          const i = layers.length - 1 - ri;
          const on = live ? active === 2 - i : i === 0;
          return (
            <motion.g key={l.label} {...popIn(play, reduce, 0.15 * ri)}>
              <path d={plane(l.y)} className={`${styles.plane} ${on ? styles.planeOn : ''}`} />
              <text x="222" y={l.y + 22} className={styles.label}>
                {l.label}
              </text>
            </motion.g>
          );
        })}
      <Packet d="M126 168 L126 52" live={live} duration={1.8} repeatDelay={0.6} />
      <motion.circle
        cx="126"
        cy="168"
        r="5"
        className={styles.core}
        animate={live ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}

/* ---- 02 Pipeline: ingest → understand → decide → act (+ review) -------- */

function Pipeline({ play, live, reduce }) {
  const nodes = [
    { x: 34, label: 'INGEST' },
    { x: 112, label: 'UNDERSTAND' },
    { x: 196, label: 'DECIDE' },
    { x: 280, label: 'ACT' },
  ];
  const y = 84;
  const branch = useCycle(3, live, 2600) === 2; // every third item goes to human review
  return (
    <>
      <motion.path d={`M34 ${y} L280 ${y}`} className={styles.rail} {...drawIn(play, reduce, 0.1, 1.2)} />
      <motion.path d={`M196 ${y} L196 160 L280 160`} className={`${styles.rail} ${styles.dashed}`} {...drawIn(play, reduce, 0.9)} />
      {nodes.map((n, i) => (
        <motion.g key={n.label} {...popIn(play, reduce, 0.2 + i * 0.12)}>
          {n.label === 'DECIDE' ? (
            <rect x={n.x - 11} y={y - 11} width="22" height="22" rx="3" transform={`rotate(45 ${n.x} ${y})`} className={styles.nodeBox} />
          ) : (
            <circle cx={n.x} cy={y} r="11" className={styles.nodeBox} />
          )}
          <text x={n.x} y={y - 24} textAnchor="middle" className={styles.label}>
            {n.label}
          </text>
        </motion.g>
      ))}
      <motion.g {...popIn(play, reduce, 1)}>
        <rect x="236" y="146" width="72" height="28" rx="14" className={`${styles.chip} ${branch && live ? styles.chipOn : ''}`} />
        <text x="272" y="164" textAnchor="middle" className={styles.label}>
          REVIEW
        </text>
      </motion.g>
      <Packet d={`M34 ${y} L196 ${y}`} live={live} duration={1.3} repeatDelay={1.3} />
      {live && !branch && <Packet d={`M196 ${y} L280 ${y}`} live={live} delay={1.2} duration={0.9} repeatDelay={1.7} />}
      {live && branch && <Packet d={`M196 ${y} L196 160 L236 160`} live={live} delay={1.2} duration={1} repeatDelay={1.6} warm />}
    </>
  );
}

/* ---- 03 Agent: plan / act / observe loop with tools -------------------- */

function Agent({ play, live, reduce }) {
  const cx = 160;
  const cy = 112;
  const tools = [
    { x: 48, y: 44, label: 'API' },
    { x: 272, y: 44, label: 'DATA' },
    { x: 48, y: 180, label: 'DOCS' },
    { x: 272, y: 180, label: 'TOOLS' },
  ];
  const step = useCycle(4, live, 1600);
  const phases = ['PLAN', 'ACT', 'OBSERVE'];
  return (
    <>
      {tools.map((t, i) => {
        const d = `M${cx} ${cy} Q ${(cx + t.x) / 2} ${t.y < cy ? cy - 10 : cy + 10} ${t.x} ${t.y}`;
        const on = live && step === i;
        return (
          <g key={t.label}>
            <motion.path d={d} className={`${styles.rail} ${on ? styles.railOn : ''}`} {...drawIn(play, reduce, 0.5 + i * 0.1)} />
            <motion.g {...popIn(play, reduce, 0.7 + i * 0.1)}>
              <rect x={t.x - 26} y={t.y - 13} width="52" height="26" rx="6" className={`${styles.chip} ${on ? styles.chipOn : ''}`} />
              <text x={t.x} y={t.y + 4} textAnchor="middle" className={styles.label}>
                {t.label}
              </text>
            </motion.g>
            {on && <Packet d={d} live={live} duration={0.8} repeatDelay={0.8} />}
          </g>
        );
      })}
      <motion.circle cx={cx} cy={cy} r="46" className={`${styles.rail} ${styles.dashed}`} {...drawIn(play, reduce, 0.1, 1.2)} />
      <motion.g
        animate={live ? { rotate: 360 } : {}}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}
      >
        <circle cx={cx + 46} cy={cy} r="3.5" className={styles.coreWarm} />
      </motion.g>
      {phases.map((p, i) => {
        const a = (-90 + i * 120) * (Math.PI / 180);
        return (
          <motion.text
            key={p}
            x={cx + Math.cos(a) * 64}
            y={cy + Math.sin(a) * 64 + 3}
            textAnchor="middle"
            className={styles.labelStrong}
            {...popIn(play, reduce, 0.4 + i * 0.1)}
          >
            {p}
          </motion.text>
        );
      })}
      <motion.g {...popIn(play, reduce, 0.2)}>
        <circle cx={cx} cy={cy} r="22" className={styles.coreFill} />
        <text x={cx} y={cy + 4} textAnchor="middle" className={styles.labelInverse}>
          AGENT
        </text>
      </motion.g>
    </>
  );
}

/* ---- 04 Web app: interface assembling ---------------------------------- */

function WebApp({ play, live, reduce }) {
  const blocks = [
    { x: 76, y: 62, w: 70, h: 44 },
    { x: 154, y: 62, w: 70, h: 44 },
    { x: 232, y: 62, w: 54, h: 44 },
    { x: 76, y: 114, w: 148, h: 70 },
    { x: 232, y: 114, w: 54, h: 70 },
  ];
  const focus = useCycle(blocks.length, live, 1500);
  return (
    <>
      <motion.rect x="24" y="20" width="272" height="180" rx="10" className={styles.frame} {...drawIn(play, reduce, 0, 1.2)} />
      <motion.path d="M24 44 L296 44" className={styles.rail} {...drawIn(play, reduce, 0.4)} />
      {[38, 50, 62].map((x, i) => (
        <motion.circle key={x} cx={x} cy="32" r="3.2" className={styles.dotMuted} {...popIn(play, reduce, 0.5 + i * 0.05)} />
      ))}
      <motion.rect x="34" y="62" width="34" height="122" rx="5" className={styles.block} {...popIn(play, reduce, 0.6)} />
      {[74, 88, 102].map((y, i) => (
        <motion.rect key={y} x="41" y={y} width="20" height="4" rx="2" className={styles.blockLine} {...popIn(play, reduce, 0.7 + i * 0.05)} />
      ))}
      {blocks.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="5"
          className={`${styles.block} ${live && focus === i ? styles.blockOn : ''}`}
          {...popIn(play, reduce, 0.8 + i * 0.1)}
        />
      ))}
      <motion.path
        d="M86 170 C 110 160, 120 140, 140 146 S 180 128, 214 126"
        className={styles.chart}
        {...drawIn(play, reduce, 1.4, 1.2)}
      />
      {live && (
        <motion.circle
          r="4"
          className={styles.cursor}
          initial={{ cx: 120, cy: 84 }}
          animate={{ cx: blocks[focus].x + blocks[focus].w / 2, cy: blocks[focus].y + blocks[focus].h / 2 }}
          transition={{ duration: 0.9, ease: ease.inOut }}
        />
      )}
    </>
  );
}

/* ---- 05 Bridge: your systems ⇄ guardrail ⇄ AI services ----------------- */

function Bridge({ play, live, reduce }) {
  const left = ['CRM', 'DATABASE', 'APPS'];
  const right = ['MODELS', 'SEARCH', 'VISION'];
  const rows = [70, 110, 150];
  return (
    <>
      <motion.text x="62" y="40" textAnchor="middle" className={styles.labelStrong} {...popIn(play, reduce, 0)}>
        YOUR SYSTEMS
      </motion.text>
      <motion.text x="258" y="40" textAnchor="middle" className={styles.labelStrong} {...popIn(play, reduce, 0.1)}>
        AI SERVICES
      </motion.text>
      {rows.map((y, i) => (
        <g key={y}>
          <motion.g {...popIn(play, reduce, 0.2 + i * 0.08)}>
            <rect x="20" y={y - 13} width="84" height="26" rx="6" className={styles.chip} />
            <text x="62" y={y + 4} textAnchor="middle" className={styles.label}>
              {left[i]}
            </text>
          </motion.g>
          <motion.g {...popIn(play, reduce, 0.3 + i * 0.08)}>
            <rect x="216" y={y - 13} width="84" height="26" rx="6" className={styles.chip} />
            <text x="258" y={y + 4} textAnchor="middle" className={styles.label}>
              {right[i]}
            </text>
          </motion.g>
          <motion.path d={`M104 ${y} C 130 ${y}, 136 110, 146 110`} className={styles.rail} {...drawIn(play, reduce, 0.6 + i * 0.08)} />
          <motion.path d={`M174 110 C 184 110, 190 ${y}, 216 ${y}`} className={styles.rail} {...drawIn(play, reduce, 0.7 + i * 0.08)} />
          <Packet d={`M104 ${y} C 130 ${y}, 136 110, 146 110`} live={live} delay={i * 0.7} duration={1.1} repeatDelay={1.4} />
          <Packet d={`M174 110 C 184 110, 190 ${y}, 216 ${y}`} live={live} delay={0.9 + i * 0.7} duration={1.1} repeatDelay={1.4} warm reverse />
        </g>
      ))}
      <motion.g {...popIn(play, reduce, 0.5)}>
        <path d="M160 88 L176 95 L176 112 C176 122 168 129 160 132 C152 129 144 122 144 112 L144 95 Z" className={styles.coreFill} />
        <path d="M153 110 L158 115 L167 104" className={styles.check} />
      </motion.g>
      <motion.text x="160" y="160" textAnchor="middle" className={styles.label} {...popIn(play, reduce, 0.9)}>
        GUARDRAILS
      </motion.text>
    </>
  );
}

const DIAGRAMS = { stack: Stack, pipeline: Pipeline, agent: Agent, webapp: WebApp, bridge: Bridge };
