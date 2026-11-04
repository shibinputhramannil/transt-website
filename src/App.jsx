import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';

import { IntroContext } from './components/intro/IntroContext.js';
import IntroSequence, { shouldPlayIntro } from './components/intro/IntroSequence.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import PageTransition from './components/layout/PageTransition.jsx';
import useHashScroll from './hooks/useHashScroll.js';

import Home from './pages/Home.jsx';

// Inner pages load on demand (smaller first download for the homepage) and are
// prefetched once the browser is idle, so navigation still feels instant.
const pageLoaders = {
  Products: () => import('./pages/Products.jsx'),
  ProductDetail: () => import('./pages/ProductDetail.jsx'),
  Services: () => import('./pages/Services.jsx'),
  About: () => import('./pages/About.jsx'),
  Contact: () => import('./pages/Contact.jsx'),
  NotFound: () => import('./pages/NotFound.jsx'),
};
const Products = lazy(pageLoaders.Products);
const ProductDetail = lazy(pageLoaders.ProductDetail);
const Services = lazy(pageLoaders.Services);
const About = lazy(pageLoaders.About);
const Contact = lazy(pageLoaders.Contact);
const NotFound = lazy(pageLoaders.NotFound);

function usePrefetchPages() {
  useEffect(() => {
    const run = () => Object.values(pageLoaders).forEach((load) => load().catch(() => {}));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(run, 2500);
    return () => clearTimeout(t);
  }, []);
}

export default function App() {
  const location = useLocation();
  // Decide once, on first render, whether the cinematic intro plays this session.
  // 'playing' → overlay covers the page; 'revealing' → circle opening, hero animates in; 'off'.
  const [intro, setIntro] = useState(() => (shouldPlayIntro(location.pathname) ? 'playing' : 'off'));
  const revealIntro = useCallback(() => setIntro('revealing'), []);
  const finishIntro = useCallback(() => setIntro('off'), []);

  useHashScroll();
  usePrefetchPages();
  // New page starts at the top — unless it targets a #section, which useHashScroll handles once mounted.
  const handleExitComplete = () => {
    if (!window.location.hash) window.scrollTo(0, 0);
  };

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={{ done: intro !== 'playing' }}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <AnimatePresence>
          {intro !== 'off' && <IntroSequence key="intro" onReveal={revealIntro} onDone={finishIntro} />}
        </AnimatePresence>

        <Header />
        <main id="main">
          <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
            <PageTransition key={location.pathname}>
              {/* min-height keeps the footer from jumping up while a page chunk loads */}
              <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-busy="true" />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </PageTransition>
          </AnimatePresence>
        </main>
        <Footer />
      </IntroContext.Provider>
    </MotionConfig>
  );
}
