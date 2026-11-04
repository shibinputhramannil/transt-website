/**
 * TRANST contact details — the ONLY place they are defined.
 *
 * Used by the site (header menu, footer, contact page and cards, CTAs) and by the build
 * (Organization JSON-LD and the <noscript> fallback in every generated HTML page).
 * Plain JavaScript with no Vite-specific code, so vite.config.js can import it too.
 *
 * ⚠ NEEDS CONFIRMATION: the WhatsApp number was supplied as 8590675644 without a country
 * code. +91 (India) is assumed. If that is wrong, change `whatsappDigits` and `whatsappDisplay`
 * together (digits only for wa.me: country code + number, no "+" or spaces).
 */
export const contact = {
  email: 'puthramannilshibin@gmail.com',
  whatsappDigits: '918590675644', // +91 assumed — confirm before launch
  whatsappDisplay: '+91 85906 75644',
  // E.164-style number for structured data (schema.org ContactPoint.telephone)
  telephone: '+91-85906-75644',
  // GitHub profile (contact cards + footer)
  github: 'https://github.com/shibinputhramannil',
  githubHandle: 'shibinputhramannil',
};
