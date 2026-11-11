/**
 * Per-route metadata — the single source for titles, descriptions and indexing rules.
 *
 * Read by the pages at runtime (useSeo) AND by the build (vite.config.js), which writes a
 * static HTML file per route with this metadata already in <head>. That way crawlers and
 * social previews that don't run JavaScript see the right title, description and robots
 * directive, and every route can be loaded directly without a server rewrite rule.
 *
 * Plain JavaScript only (no Vite APIs) so the build can import it.
 */
import { products } from './products.js';

export const SITE_NAME = 'TRANST';
export const TAGLINE = 'Intelligence, built into every solution.';
export const DEFAULT_TITLE = `${SITE_NAME} — Intelligence, built into every solution`;
export const DEFAULT_DESCRIPTION =
  'TRANST designs and builds AI-powered software, intelligent automation, AI agents, custom web applications and AI integrations.';
export const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630, alt: 'TRANST logo with the tagline: Intelligence, built into every solution.' };

/** Static routes. `title: null` → the default title (homepage). */
export const pages = {
  '/': { title: null, description: DEFAULT_DESCRIPTION },
  '/products': {
    title: 'Products',
    description:
      'TRANST software products: TRANST ERP for business operations, Kitchen OS and KitchenMind AI for kitchens, an e-commerce platform, and CoreKnowledge for your documents.',
  },
  '/services': {
    title: 'Services',
    description:
      'AI-powered software, intelligent automation, AI agents, custom web applications and AI integration — the five ways TRANST builds intelligence into your business.',
  },
  '/about': {
    title: 'About',
    description:
      'TRANST is a software company that makes AI practical: intelligence designed into the tools people already depend on, carefully and transparently.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Contact TRANST by email or WhatsApp about AI-powered software, automation, AI agents, web applications or AI integration.',
  },
};

export const notFoundMeta = { title: 'Page not found', description: 'The page you are looking for does not exist or has moved.', noindex: true };

/** Product detail pages: the product's summary is its description (in-development products say so in it). */
export function productMeta(product) {
  if (!product) return { title: 'Product not found', description: notFoundMeta.description, noindex: true };
  return { title: product.name, description: product.summary, noindex: false };
}

export const fullTitle = (title) => (title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE);

/** Every route the build writes an HTML file for, with its metadata. */
export function allRoutes() {
  return [
    ...Object.entries(pages).map(([path, meta]) => ({ path, ...meta })),
    ...products.map((p) => ({ path: `/products/${p.slug}`, ...productMeta(p) })),
  ];
}
