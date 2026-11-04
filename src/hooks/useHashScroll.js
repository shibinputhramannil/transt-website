import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * After navigation, scroll to `#hash` targets once the new page has mounted
 * (route transitions delay mounting, so poll briefly for the element).
 */
export default function useHashScroll() {
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      } else if (tries++ < 20) {
        timer = setTimeout(attempt, 60);
      }
    };
    timer = setTimeout(attempt, 300); // after the 0.22s route exit
    return () => clearTimeout(timer);
  }, [hash, key]);
}
