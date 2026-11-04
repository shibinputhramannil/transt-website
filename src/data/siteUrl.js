/**
 * Validation for the production domain (VITE_SITE_URL).
 * Plain JavaScript: used by vite.config.js at build time and by the app at runtime.
 *
 * Accepted:  https://www.example.com   http://localhost:4173   (no path, query or hash)
 * Returns '' when the value is empty, the normalised origin when valid, and throws on
 * anything else so a typo can never produce misleading absolute URLs.
 */
export function normalizeSiteUrl(value) {
  const raw = (value ?? '').trim();
  if (!raw) return '';
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`VITE_SITE_URL must be an absolute URL such as https://www.example.com — got "${raw}"`);
  }
  if (!/^https?:$/.test(url.protocol)) {
    throw new Error(`VITE_SITE_URL must start with https:// (or http:// for local testing) — got "${raw}"`);
  }
  if ((url.pathname && url.pathname !== '/') || url.search || url.hash) {
    throw new Error(`VITE_SITE_URL must be the bare origin with no path, query or hash — got "${raw}"`);
  }
  return url.origin;
}
