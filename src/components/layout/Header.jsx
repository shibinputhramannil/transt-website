import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Logo from '../brand/Logo.jsx';
import Button from '../ui/Button.jsx';
import { nav, site, mailto, whatsappLink } from '../../data/site.js';
import { ease } from '../../motion/tokens.js';
import styles from './Header.module.css';

export default function Header() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);
  const returnFocus = useRef(false); // true when closed by the visitor (toggle / Esc), not by navigation

  const close = (restoreFocus = true) => {
    returnFocus.current = restoreFocus;
    setOpen(false);
  };

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 160 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  // Expose header visibility so sticky sub-navigation can sit directly beneath it.
  useEffect(() => {
    document.documentElement.dataset.header = hidden ? 'hidden' : 'shown';
  }, [hidden]);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  // Mobile menu behaves as a modal: page behind is inert, focus moves in, Esc closes,
  // and focus returns to the toggle when the visitor closes it.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const background = [document.getElementById('main'), document.querySelector('#root > footer'), document.querySelector('.skip-link')].filter(Boolean);
    if (open) {
      background.forEach((el) => el.setAttribute('inert', ''));
      const t = setTimeout(() => menuRef.current?.querySelector('a')?.focus(), 60);
      const onKey = (e) => {
        if (e.key !== 'Escape') return;
        returnFocus.current = true;
        setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      // the menu only exists below 901px — close it if the viewport grows past that
      const mq = window.matchMedia('(min-width: 901px)');
      const onResize = () => mq.matches && setOpen(false);
      mq.addEventListener('change', onResize);
      return () => {
        clearTimeout(t);
        window.removeEventListener('keydown', onKey);
        mq.removeEventListener('change', onResize);
        background.forEach((el) => el.removeAttribute('inert'));
      };
    }
    if (returnFocus.current) {
      returnFocus.current = false;
      toggleRef.current?.focus();
    }
    return undefined;
  }, [open]);

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled || open ? styles.solid : ''} ${open ? styles.menuOpen : ''}`}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: ease.out }}
      >
        <div className={`container-wide ${styles.inner}`}>
          <Link to="/" className={styles.brand} aria-label="TRANST — home">
            <Logo height={30} alt="" />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul role="list" className={styles.links}>
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span layoutId="nav-pill" className={styles.pill} transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                        )}
                        <span className={styles.linkText}>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Button to="/contact" size="sm" className={styles.cta}>
              Get in touch
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => (open ? close(true) : setOpen(true))}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-label="Site menu"
            className={styles.menu}
            initial={{ clipPath: 'circle(0% at 92% 36px)' }}
            animate={{ clipPath: 'circle(150% at 92% 36px)' }}
            exit={{ clipPath: 'circle(0% at 92% 36px)', pointerEvents: 'none' }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <nav aria-label="Mobile">
              <motion.ul
                role="list"
                className={styles.menuLinks}
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
              >
                {[{ label: 'Home', to: '/' }, ...nav].map((item, i) => (
                  <motion.li
                    key={item.to}
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `${styles.menuLink} ${isActive ? styles.menuActive : ''}`}
                    >
                      <span className="t-mono">{String(i).padStart(2, '0')}</span>
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>
            <motion.div
              className={styles.menuFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
            >
              <a href={mailto()}>{site.contact.email}</a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp {site.contact.whatsappDisplay}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
