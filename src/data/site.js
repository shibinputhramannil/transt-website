/**
 * Global site content. Edit here — components read from this file.
 * Contact details live in ./contact.js; route titles/descriptions in ./seo.js.
 */
import { contact } from './contact.js';
import { SITE_NAME, TAGLINE, DEFAULT_DESCRIPTION } from './seo.js';
import { normalizeSiteUrl } from './siteUrl.js';

/**
 * Public production domain (e.g. https://www.example.com), from VITE_SITE_URL at build time.
 * Empty when not configured: the site then emits NO absolute canonical / og:url values rather
 * than guessing from whatever host happens to serve it. The build validates the value first.
 */
export const SITE_URL = normalizeSiteUrl(import.meta.env.VITE_SITE_URL);

export const site = {
  name: SITE_NAME,
  tagline: TAGLINE,
  description: DEFAULT_DESCRIPTION,
  contact,
};

export const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const mailto = (subject = '', body = '') => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const q = params.toString().replace(/\+/g, '%20');
  return `mailto:${contact.email}${q ? `?${q}` : ''}`;
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${contact.whatsappDigits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
