import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/site.js';
import { SITE_NAME, DEFAULT_DESCRIPTION, OG_IMAGE, fullTitle } from '../data/seo.js';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (href == null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Keeps <head> in sync on client-side navigation. Values come from src/data/seo.js — the same
 * data the build bakes into each route's HTML file, so first load and navigation always agree.
 *
 *   useSeo(pages['/about'])          useSeo(productMeta(product))          useSeo(notFoundMeta)
 *
 * Without a configured domain (VITE_SITE_URL) no absolute URLs are emitted: canonical and og:url
 * are removed and the share image stays a relative path.
 */
export default function useSeo({ title = null, description = DEFAULT_DESCRIPTION, noindex = false, type = 'website' } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const t = fullTitle(title);
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    // same rule as the build: canonical/og:url only with a configured domain, and never on noindex pages
    const url = SITE_URL && !noindex ? `${SITE_URL}${path}` : null;
    const image = `${SITE_URL}${OG_IMAGE.path}`;

    document.title = t;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setCanonical(url);

    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', t);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', t);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
  }, [title, description, noindex, type, pathname]);
}
