import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ease } from '../../motion/tokens.js';
import styles from './AICircle.module.css';

/**
 * TRANST Signature AI Circle.
 *
 * A scalable SVG "intelligence" diagram: orbital rings, capability nodes, data paths
 * and a pulsing core. Purely presentational — wrap it in any container; it fills the width.
 *
 * Props
 *  play         start the draw-in sequence (e.g. wait for the intro to finish)
 *  tone         'light' (on cream) | 'dark' (on charcoal)
 *  nodes        override the capability nodes [{ id, label, ring: 'inner'|'outer', angle }]
 *  interactive  enable pointer parallax + node focus (auto-disabled on touch / reduced motion)
 *  labels       'auto' | true | false — auto hides labels when rendered narrower than 380px
 *  ariaLabel    description for assistive tech
 *  active       controlled focus node id (e.g. chosen via external buttons); omit to auto-tour
 *  paused       stop all ambient motion and the auto-tour (user pause control)
 *  onActiveChange(id)  reports the node currently in focus (tour, hover or controlled)
 *  onSelect(id)        a node was clicked / tapped inside the sphere
 */

const R = { core: 58, inner: 132, mid: 186, outer: 238, dial: 262 };

export const DEFAULT_NODES = [
  { id: 'language', label: 'Language', ring: 'outer', angle: -112, text: 'Understands text, documents and conversations in context.' },
  { id: 'reasoning', label: 'Reasoning', ring: 'inner', angle: -58, text: 'Weighs rules, evidence and context to reach a decision.' },
  { id: 'agents', label: 'Agents', ring: 'outer', angle: -18, text: 'Plans multi-step work and uses tools to complete it.' },
  { id: 'automation', label: 'Automation', ring: 'inner', angle: 32, text: 'Runs workflows end to end, with people in the loop.' },
  { id: 'integration', label: 'Integration', ring: 'outer', angle: 68, text: 'Connects AI to the systems you already rely on.' },
  { id: 'interfaces', label: 'Interfaces', ring: 'outer', angle: 128, text: 'Puts intelligence into screens people enjoy using.' },
  { id: 'data', label: 'Data', ring: 'inner', angle: 168, text: 'Turns scattered information into something usable.' },
  { id: 'memory', label: 'Memory', ring: 'outer', angle: -164, text: 'Keeps the context needed to take the next step.' },
];

// Node-to-node chords that make the network read as connected, not radial only.
const CHORDS = [
  ['language', 'reasoning'],
  ['reasoning', 'agents'],
  ['agents', 'automation'],
  ['automation', 'integration'],
  ['interfaces', 'data'],
  ['data', 'memory'],
  ['memory', 'language'],
];

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const f = (n) => Math.round(n * 100) / 100;

function arcPath(r, start, end) {
  const [x1, y1] = polar(r, start);
  const [x2, y2] = polar(r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${f(x1)} ${f(y1)} A ${r} ${r} 0 ${large} 1 ${f(x2)} ${f(y2)}`;
}

/** Curved link from the core edge to a node — bends slightly so links don't read as spokes. */
function linkPath(node) {
  const r = R[node.ring];
  const [sx, sy] = polar(R.core + 6, node.angle - 14);
  const [cx, cy] = polar((R.core + r) / 2, node.angle + 16);
  const [ex, ey] = polar(r, node.angle);
  return `M ${f(sx)} ${f(sy)} Q ${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`;
}

function chordPath(a, b) {
  const [ax, ay] = polar(R[a.ring], a.angle);
  const [bx, by] = polar(R[b.ring], b.angle);
  const mid = (a.angle + b.angle) / 2 + (Math.abs(a.angle - b.angle) > 180 ? 180 : 0);
  const [cx, cy] = polar((R[a.ring] + R[b.ring]) / 2 + 26, mid);
  return `M ${f(ax)} ${f(ay)} Q ${f(cx)} ${f(cy)} ${f(bx)} ${f(by)}`;
}

export default function AICircle({
  play = true,
  tone = 'light',
  nodes = DEFAULT_NODES,
  interactive = true,
  labels = 'auto',
  className = '',
  active: activeProp,
  paused = false,
  onActiveChange,
  onSelect,
  ariaLabel = 'Animated diagram of an AI core connected to capabilities such as language, reasoning, agents, automation, integration, interfaces, data and memory.',
}) {
  const uid = useId().replace(/:/g, '');
  const wrapRef = useRef(null);
  const reduce = useReducedMotion();
  const inView = useInView(wrapRef, { amount: 0.15 });
  const [width, setWidth] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [cycled, setCycled] = useState(0);
  const [finePointer, setFinePointer] = useState(false);

  const live = play && inView && !reduce && !paused; // ambient motion only while visible
  const showLabels = labels === 'auto' ? width >= 380 : labels;
  const active = hovered ?? activeProp ?? nodes[cycled % nodes.length]?.id;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const links = useMemo(() => nodes.map((n) => ({ id: n.id, d: linkPath(n) })), [nodes]);
  const chords = useMemo(
    () =>
      CHORDS.filter(([a, b]) => byId[a] && byId[b]).map(([a, b]) => ({
        key: `${a}-${b}`,
        a,
        b,
        d: chordPath(byId[a], byId[b]),
      })),
    [byId],
  );

  // Track rendered size for label visibility.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Slow focus cycle when nobody is interacting: the core "attends" to one capability at a time.
  useEffect(() => {
    if (!live || hovered || activeProp) return undefined;
    const t = setInterval(() => setCycled((c) => c + 1), 3600);
    return () => clearInterval(t);
  }, [live, hovered, activeProp]);

  // Pointer parallax (desktop only).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.8 });
  const parallax = interactive && finePointer && !reduce;

  useEffect(() => {
    if (!parallax || !inView) return undefined;
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const nx = (e.clientX - (b.left + b.width / 2)) / (window.innerWidth / 2);
      const ny = (e.clientY - (b.top + b.height / 2)) / (window.innerHeight / 2);
      px.set(Math.max(-1, Math.min(1, nx)));
      py.set(Math.max(-1, Math.min(1, ny)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, inView, px, py]);

  // Depth layers in viewBox units.
  const glowX = useTransform(sx, (v) => v * -8);
  const glowY = useTransform(sy, (v) => v * -8);
  const ringX = useTransform(sx, (v) => v * 7);
  const ringY = useTransform(sy, (v) => v * 7);
  const nodeX = useTransform(sx, (v) => v * 14);
  const nodeY = useTransform(sy, (v) => v * 14);
  const coreX = useTransform(sx, (v) => v * 3);
  const coreY = useTransform(sy, (v) => v * 3);
  const tilt = useTransform(sx, (v) => v * 4);

  const draw = (delay, duration = 1.4) =>
    reduce
      ? { initial: false }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
          transition: { pathLength: { duration, ease: ease.inOut, delay }, opacity: { duration: 0.3, delay } },
        };

  const appear = (delay) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, scale: 0.6 },
          animate: play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 },
          transition: { duration: 0.7, ease: ease.out, delay },
        };

  const ticks = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const a = i * 5;
        const major = a % 45 === 0;
        const [x1, y1] = polar(R.dial - (major ? 9 : 4), a);
        const [x2, y2] = polar(R.dial, a);
        return { key: i, x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), major };
      }),
    [],
  );

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${styles[tone]} ${className}`}
      role="img"
      aria-label={ariaLabel}
      onPointerLeave={() => setHovered(null)}
    >
      <svg viewBox="-300 -300 600 600" className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id={`${uid}-glow`} cx="0" cy="0" r="300" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--aic-glow)" stopOpacity="0.55" />
            <stop offset="0.45" stopColor="var(--aic-glow)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--aic-glow)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-warm`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#E8C5A3" stopOpacity={tone === 'dark' ? 0.22 : 0.55} />
            <stop offset="1" stopColor="#E8C5A3" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${uid}-core`} cx="-0.25" cy="-0.3" r="1.1">
            <stop offset="0" stopColor="#4F8A73" />
            <stop offset="0.55" stopColor="#245C49" />
            <stop offset="1" stopColor="#163A2E" />
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <motion.g style={{ x: glowX, y: glowY }}>
          <circle r="300" fill={`url(#${uid}-glow)`} />
          <motion.circle
            cx="70"
            cy="-60"
            r="150"
            fill={`url(#${uid}-warm)`}
            animate={live ? { opacity: [0.5, 0.85, 0.5] } : { opacity: 0.6 }}
            transition={live ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
          />
        </motion.g>

        {/* Rings, dial and arc segments */}
        <motion.g style={{ x: ringX, y: ringY, rotate: tilt }}>
          <motion.g
            className={styles.ticks}
            initial={reduce ? false : { opacity: 0, rotate: -20 }}
            animate={{ opacity: play ? 1 : 0, rotate: 0 }}
            transition={{ duration: reduce ? 0 : 1.4, ease: ease.out, delay: reduce ? 0 : 0.15 }}
          >
            {ticks.map((t) => (
              <line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.major ? styles.tickMajor : undefined} />
            ))}
          </motion.g>

          <motion.circle r={R.outer} className={styles.ring} {...draw(0.1, 1.6)} />
          <motion.circle r={R.mid} className={`${styles.ring} ${styles.ringDashed}`} {...draw(0.25, 1.6)} />
          <motion.circle r={R.inner} className={styles.ring} {...draw(0.4, 1.6)} />

          {/* Arcs echoing the brand mark — they breathe, they don't spin. */}
          <motion.g
            animate={live ? { rotate: [0, 10, 0] } : { rotate: 0 }}
            transition={live ? { duration: 16, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
          >
            <circle r={R.dial} className={styles.anchor} />
            <motion.path d={arcPath(R.mid + 14, -150, -28)} className={styles.arc} {...draw(0.6, 1.4)} />
            <motion.path d={arcPath(R.mid + 14, 30, 140)} className={styles.arc} {...draw(0.75, 1.4)} />
          </motion.g>
          <motion.g
            animate={live ? { rotate: [0, -12, 0] } : { rotate: 0 }}
            transition={live ? { duration: 20, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
          >
            <circle r={R.dial} className={styles.anchor} />
            <motion.path d={arcPath(R.inner - 18, 200, 300)} className={`${styles.arc} ${styles.arcWarm}`} {...draw(0.9, 1.2)} />
            <motion.path d={arcPath(R.inner - 18, 20, 120)} className={`${styles.arc} ${styles.arcWarm}`} {...draw(1.0, 1.2)} />
          </motion.g>
        </motion.g>

        {/* Network: chords, links, packets, nodes */}
        <motion.g style={{ x: nodeX, y: nodeY }}>
          {chords.map((c, i) => {
            const on = c.a === active || c.b === active;
            return (
              <motion.path
                key={c.key}
                d={c.d}
                className={`${styles.chord} ${on ? styles.on : ''}`}
                {...draw(1.0 + i * 0.05, 1.1)}
              />
            );
          })}

          {links.map((l, i) => (
            <motion.path
              key={l.id}
              d={l.d}
              className={`${styles.link} ${l.id === active ? styles.on : ''}`}
              {...draw(0.9 + i * 0.06, 1)}
            />
          ))}

          {/* Data packets: only along the active capability's paths, only while visible. */}
          {live &&
            active &&
            [0, 1, 2].map((k) => {
              const linkD = links.find((l) => l.id === active)?.d;
              if (!linkD) return null;
              return (
                <motion.path
                  key={`${active}-${k}`}
                  d={linkD}
                  pathLength="1"
                  className={styles.packet}
                  strokeDasharray="0.07 1.2"
                  initial={{ strokeDashoffset: k % 2 ? -1 : 0.07, opacity: 0 }}
                  animate={{ strokeDashoffset: k % 2 ? 0.07 : -1, opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.15 + k * 0.5, repeat: Infinity, repeatDelay: 0.6 }}
                />
              );
            })}
          {live &&
            chords
              .filter((c) => c.a === active || c.b === active)
              .map((c) => (
                <motion.path
                  key={`p-${c.key}-${active}`}
                  d={c.d}
                  pathLength="1"
                  className={`${styles.packet} ${styles.packetWarm}`}
                  strokeDasharray="0.06 1.2"
                  initial={{ strokeDashoffset: c.a === active ? 0.06 : -1 }}
                  animate={{ strokeDashoffset: c.a === active ? -1 : 0.06 }}
                  transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.5, repeat: Infinity, repeatDelay: 1 }}
                />
              ))}

          {nodes.map((n, i) => {
            const [x, y] = polar(R[n.ring], n.angle);
            const on = n.id === active;
            const right = Math.cos(rad(n.angle)) >= -0.15;
            const lx = x + (right ? 14 : -14);
            return (
              <g
                key={n.id}
                className={`${styles.node} ${on ? styles.on : ''}`}
                transform={`translate(${f(x)} ${f(y)})`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(n.id)}
                onClick={() => {
                  setCycled(i);
                  onSelect?.(n.id);
                }}
              >
                <motion.g {...appear(1.1 + i * 0.07)}>
                  {/* generous invisible hit target */}
                  <circle r="30" className={styles.hit} />
                  <motion.circle
                    r="13"
                    className={styles.halo}
                    animate={{ scale: on ? 1 : 0.4, opacity: on ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.45, ease: ease.out }}
                  />
                  <circle r={on ? 6 : 4.5} className={styles.dot} />
                </motion.g>
                {showLabels && (
                  <motion.text
                    x={f(lx - x)}
                    y="4"
                    textAnchor={right ? 'start' : 'end'}
                    className={styles.label}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: play ? (on ? 1 : 0.62) : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {n.label}
                  </motion.text>
                )}
              </g>
            );
          })}
        </motion.g>

        {/* Core */}
        <motion.g style={{ x: coreX, y: coreY }}>
          <motion.circle
            r={R.core + 16}
            className={styles.coreHalo}
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={
              live
                ? { scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }
                : { scale: 1, opacity: play ? 0.4 : 0 }
            }
            transition={live ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
          />
          <motion.g {...appear(0.35)}>
            <circle r={R.core} fill={`url(#${uid}-core)`} />
            <circle r={R.core - 12} className={styles.coreRing} />
            <path d={arcPath(R.core - 24, -120, 20)} className={styles.coreArc} />
            <path d={arcPath(R.core - 24, 60, 200)} className={styles.coreArc} />
            <motion.circle
              r="7"
              className={styles.coreDot}
              animate={live ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={live ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
