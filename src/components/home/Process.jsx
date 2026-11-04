import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader.jsx';
import { RevealGroup, RevealItem } from '../ui/Reveal.jsx';
import { steps } from '../../data/approach.js';
import { ease } from '../../motion/tokens.js';
import styles from './Process.module.css';

/** Index of the step whose card has crossed the reading line (55% down the viewport). */
function useActiveStep(refs) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let current = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [refs]);
  return active;
}

/**
 * Discovery → delivery. Desktop: a sticky tracker (numeral + progress) beside the step cards,
 * following the reader's position. Mobile: a simple stacked timeline.
 */
export default function Process({ tone = 'band' }) {
  const stepRefs = useRef([]);
  const active = useActiveStep(stepRefs);

  return (
    <section className={`section ${tone === 'band' ? styles.section : ''}`} aria-labelledby="process-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <SectionHeader
            eyebrow="How we work"
            id="process-title"
            title="From discovery to *delivery.*"
            lead="A clear, four-stage rhythm that keeps the people who will use the system involved from the first conversation to launch."
          />
          <div className={styles.tracker} aria-hidden="true">
            <div className={styles.numeral}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: '60%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-60%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: ease.out }}
                >
                  {String(active + 1).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className={styles.trackerMeta}>
              <span className="t-mono">Stage {active + 1} of {steps.length}</span>
              <span className={styles.trackerTitle}>{steps[active].title}</span>
              <div className={styles.bars}>
                {steps.map((s, i) => (
                  <span key={s.id} className={i <= active ? styles.barOn : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <RevealGroup as="ol" role="list" className={styles.steps} stagger={0.1}>
          {steps.map((s, i) => (
            <RevealItem
              as="li"
              key={s.id}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`${styles.step} ${i === active ? styles.stepOn : ''}`}
            >
              <span className={styles.marker} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.body}>
                <p className={`t-mono ${styles.kicker}`}>Stage {String(i + 1).padStart(2, '0')}</p>
                <h3 className="t-h3">{s.title}</h3>
                <p className="t-body">{s.text}</p>
                <p className={styles.outcome}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    <span className={styles.outcomeLabel}>Outcome: </span>
                    {s.outcome}
                  </span>
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
