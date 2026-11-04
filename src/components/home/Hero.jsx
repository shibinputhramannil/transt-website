import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ParticleSphere from '../ai/ParticleSphere.jsx';
import Aurora from '../ai/Aurora.jsx';
import Button from '../ui/Button.jsx';
import SplitText from '../ui/SplitText.jsx';
import { useIntro } from '../intro/IntroContext.js';
import { ease } from '../../motion/tokens.js';
import styles from './Hero.module.css';

/**
 * Homepage hero: a dark stage with the TRANST particle sphere at its centre and the headline
 * set inside it; description + CTAs bottom-right, motion control bottom-left, aurora light below.
 */
export default function Hero() {
  const { done } = useIntro();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const enter = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: done ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.9, ease: ease.out, delay },
  });

  return (
    <section
      ref={sectionRef}
      className={`on-dark ${styles.hero} ${paused ? styles.paused : ''}`}
      aria-labelledby="hero-title"
    >
      <Aurora play={done} paused={paused} className={styles.aurora} fallbackClassName={styles.auroraStatic} />

      <div className={`container-wide ${styles.inner}`}>
        <div className={styles.stage}>
          <motion.div
            className={styles.sphere}
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 1.2, ease: ease.out }}
          >
            <ParticleSphere play={done} paused={paused} interactionRef={sectionRef} />
          </motion.div>

          <div className={styles.center}>
            <motion.p className={styles.label} {...enter(0.5)}>
              AI software · Automation · Agents
            </motion.p>
            <SplitText
              as="h1"
              id="hero-title"
              text="Intelligence,|built into *every*|solution."
              className={styles.title}
              trigger={done}
              delay={0.6}
              stagger={0.07}
            />
          </div>
        </div>

        <motion.div className={styles.side} {...enter(1.1)}>
          <p className={styles.lead}>
            TRANST designs and builds AI-powered software, intelligent automation and AI agents — and connects them to
            the systems your business already runs on.
          </p>
          <div className={styles.ctas}>
            <Button to="/products" variant="light">
              Explore products
            </Button>
            <Button to="/contact" variant="outlineLight">
              Get in touch
            </Button>
          </div>
        </motion.div>

      </div>

      {/* Not shown on screen; appears only when reached with the keyboard (like a skip link),
          so keyboard and screen-reader users can still stop the animation (WCAG 2.2.2). */}
      {!reduce && (
        <button
          type="button"
          className={styles.pause}
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3.5v9l7-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          <span>{paused ? 'Play motion' : 'Pause motion'}</span>
        </button>
      )}
    </section>
  );
}
