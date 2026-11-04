import { motion } from 'framer-motion';
import SplitText from '../ui/SplitText.jsx';
import { ease } from '../../motion/tokens.js';
import styles from './PageHero.module.css';

/** Hero used by inner pages: editorial title on the left, optional visual on the right. */
export default function PageHero({ eyebrow, title, lead, visual, children, compact = false, id = 'page-title' }) {
  const enter = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: ease.out, delay },
  });

  return (
    <section className={`${styles.hero} ${visual ? styles.withVisual : ''} ${compact ? styles.compact : ''}`} aria-labelledby={id}>
      <div className={`grid-bg ${styles.grid}`} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {eyebrow && (
            <motion.div className="eyebrow" {...enter(0.05)}>
              {eyebrow}
            </motion.div>
          )}
          <SplitText as="h1" id={id} text={title} className={`t-h1 ${styles.title}`} trigger="mount" delay={0.1} />
          {lead && (
            <motion.p className="t-lead" {...enter(0.35)}>
              {lead}
            </motion.p>
          )}
          {children && (
            <motion.div className={styles.extra} {...enter(0.5)}>
              {children}
            </motion.div>
          )}
        </div>
        {visual && (
          <motion.div
            className={styles.visual}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: ease.out, delay: 0.15 }}
          >
            {visual}
          </motion.div>
        )}
      </div>
    </section>
  );
}
