import { motion } from 'framer-motion';
import { fadeUp, inViewOnce, staggerChildren, stagger as st } from '../../motion/tokens.js';

/** Scroll-triggered fade-and-rise for a single block. */
export function Reveal({ as = 'div', delay = 0, children, className, ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={{
        hidden: fadeUp.hidden,
        show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } },
      }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Parent that staggers its <RevealItem> children as the group scrolls into view. */
export function RevealGroup({ as = 'div', stagger = st.base, delay = 0, children, className, ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      variants={staggerChildren(stagger, delay)}
      {...rest}
    >
      {children}
    </M>
  );
}

export function RevealItem({ as = 'div', children, className, ...rest }) {
  const M = motion[as];
  return (
    <M className={className} variants={fadeUp} {...rest}>
      {children}
    </M>
  );
}
