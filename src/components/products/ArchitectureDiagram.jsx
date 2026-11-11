import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ease } from '../../motion/tokens.js';
import styles from './ArchitectureDiagram.module.css';

const LAYERS = [
  { id: 'input', label: 'Inputs' },
  { id: 'core', label: 'Core' },
  { id: 'output', label: 'Outcomes' },
];

/**
 * Interactive architecture diagram driven by product data:
 * nodes in three layers (input → core → output), connectors measured from the DOM so the
 * layout can reflow (columns on desktop, stacked on mobile). Selecting a node highlights its
 * paths, animates data along them and shows its description.
 */
export default function ArchitectureDiagram({ nodes }) {
  const wrapRef = useRef(null);
  const nodeRefs = useRef({});
  const [paths, setPaths] = useState([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState(nodes.find((n) => n.layer === 'core')?.id ?? nodes[0]?.id);
  const reduce = useReducedMotion();
  const inView = useInView(wrapRef, { amount: 0.25 });
  const seen = useInView(wrapRef, { amount: 0.25, once: true });

  const byLayer = (layer) => nodes.filter((n) => n.layer === layer);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wb = wrap.getBoundingClientRect();
    setSize({ w: wb.width, h: wb.height });
    const box = (id) => {
      const el = nodeRefs.current[id];
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { l: b.left - wb.left, r: b.right - wb.left, t: b.top - wb.top, btm: b.bottom - wb.top, cx: b.left - wb.left + b.width / 2, cy: b.top - wb.top + b.height / 2 };
    };
    const next = [];
    // Layers sit side by side above the CSS breakpoint (see .diagram in the module CSS), stacked below it.
    const sideBySide = window.matchMedia('(min-width: 721px)').matches;
    // Every input connects to every core node, and every core node to every output.
    const inLayer = (layer) => nodes.filter((n) => n.layer === layer);
    const edges = [];
    inLayer('input').forEach((x) => inLayer('core').forEach((y) => edges.push([x.id, y.id])));
    inLayer('core').forEach((x) => inLayer('output').forEach((y) => edges.push([x.id, y.id])));
    for (const [from, to] of edges) {
      const a = box(from);
      const b = box(to);
      if (!a || !b) continue;
      let d;
      if (!sideBySide) {
        // layers stacked (mobile) → vertical S-curve
        const mid = (a.btm + b.t) / 2;
        d = `M ${a.cx} ${a.btm} C ${a.cx} ${mid}, ${b.cx} ${mid}, ${b.cx} ${b.t}`;
      } else {
        // layers side by side → horizontal S-curve
        const mid = (a.r + b.l) / 2;
        d = `M ${a.r} ${a.cy} C ${mid} ${a.cy}, ${mid} ${b.cy}, ${b.l} ${b.cy}`;
      }
      next.push({ key: `${from}-${to}`, from, to, d });
    }
    setPaths(next);
  }, [nodes]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const isLinked = (p) => p.from === selected || p.to === selected;
  const sel = nodes.find((n) => n.id === selected);

  return (
    <div className={styles.root}>
      <div ref={wrapRef} className={styles.diagram}>
        <svg className={styles.svg} width={size.w} height={size.h} aria-hidden="true">
          {paths.map((p, i) => (
            <motion.path
              key={p.key}
              d={p.d}
              className={`${styles.edge} ${isLinked(p) ? styles.edgeOn : ''}`}
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: seen ? 1 : 0 }}
              transition={{ duration: 0.9, ease: ease.inOut, delay: reduce ? 0 : 0.2 + i * 0.03 }}
            />
          ))}
          {!reduce &&
            inView &&
            paths.filter(isLinked).map((p, i) => (
              <motion.path
                key={`pk-${p.key}-${selected}`}
                d={p.d}
                pathLength="1"
                className={styles.packet}
                strokeDasharray="0.08 1.2"
                initial={{ strokeDashoffset: 0.08 }}
                animate={{ strokeDashoffset: -1 }}
                transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.8, delay: 0.3 + i * 0.15 }}
              />
            ))}
        </svg>

        {LAYERS.map((layer) => (
          <div key={layer.id} className={`${styles.col} ${styles[layer.id]}`}>
            <p className={`t-mono ${styles.colLabel}`}>{layer.label}</p>
            {byLayer(layer.id).map((n) => {
              const on = n.id === selected;
              return (
                <button
                  key={n.id}
                  ref={(el) => (nodeRefs.current[n.id] = el)}
                  type="button"
                  className={`${styles.node} ${on ? styles.nodeOn : ''} ${n.planned ? styles.nodePlanned : ''}`}
                  aria-pressed={on}
                  onClick={() => setSelected(n.id)}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setSelected(n.id)}
                >
                  <span className={styles.nodeDot} aria-hidden="true" />
                  {n.label}
                  {n.planned && <span className="visually-hidden"> (planned)</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.detail} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {sel && (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <p className="t-mono">
                {LAYERS.find((l) => l.id === sel.layer)?.label}
                {sel.planned && ' · Planned'}
              </p>
              <h3 className="t-h3">{sel.label}</h3>
              <p className="t-body">{sel.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
