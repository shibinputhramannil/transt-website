import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ease } from '../../motion/tokens.js';

/**
 * Route-level enter/exit: a short fade with a slight rise. Kept fast so navigation never feels blocked.
 * After a client-side navigation, focus moves to the new page's <h1> so assistive tech announces it
 * and keyboard users continue from the top of the new content.
 */
export default function PageTransition({ children }) {
  const ref = useRef(null);
  const { key, hash } = useLocation();

  useEffect(() => {
    // The first page of a visit (location key "default") is announced by the browser itself;
    // only client-side navigations need focus moved for keyboard and screen-reader users.
    if (key === 'default') return undefined;
    if (hash) return undefined; // in-page target: useHashScroll handles it
    let tries = 0;
    let timer;
    const focusHeading = () => {
      const h1 = ref.current?.querySelector('h1');
      if (h1) {
        h1.setAttribute('tabindex', '-1');
        h1.setAttribute('data-route-focus', '');
        h1.focus({ preventScroll: true });
      } else if (tries++ < 20) {
        timer = setTimeout(focusHeading, 50); // lazy page chunk still loading
      }
    };
    timer = setTimeout(focusHeading, 30);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per mounted page
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.22, ease: ease.in } }}
    >
      {children}
    </motion.div>
  );
}
