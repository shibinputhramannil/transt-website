import { products, categories } from './products.js';

/**
 * Development-only sanity check for src/data/products.js.
 * Reports problems in the browser console so a half-filled entry is caught before release.
 * Imported from main.jsx behind `import.meta.env.DEV`, so it never ships in production.
 */
export default function validateProducts() {
  const problems = [];
  const slugs = new Set();
  const categoryIds = new Set(categories.map((c) => c.id));
  const layers = new Set(['input', 'core', 'output']);
  const isText = (v) => typeof v === 'string' && v.trim().length > 0;

  products.forEach((p, i) => {
    const at = `products[${i}]${p?.slug ? ` (${p.slug})` : ''}`;
    if (!isText(p.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) problems.push(`${at}: slug must be lowercase words joined by hyphens`);
    if (slugs.has(p.slug)) problems.push(`${at}: duplicate slug`);
    slugs.add(p.slug);
    ['name', 'summary', 'description'].forEach((k) => !isText(p[k]) && problems.push(`${at}: missing ${k}`));
    if (!categoryIds.has(p.category)) problems.push(`${at}: unknown category "${p.category}"`);
    if (!Array.isArray(p.capabilities) || !p.capabilities.every((c) => isText(c.title) && isText(c.text))) problems.push(`${at}: capabilities need { title, text }`);
    if (!Array.isArray(p.benefits) || !p.benefits.every(isText)) problems.push(`${at}: benefits must be a list of strings`);
    if (!Array.isArray(p.useCases) || !p.useCases.every((u) => isText(u.title) && isText(u.text))) problems.push(`${at}: useCases need { title, text }`);
    if (!Array.isArray(p.architecture) || !p.architecture.every((n) => isText(n.id) && isText(n.label) && layers.has(n.layer))) {
      problems.push(`${at}: architecture nodes need { id, label, layer: input|core|output, text }`);
    } else if (!['input', 'core', 'output'].every((l) => p.architecture.some((n) => n.layer === l))) {
      problems.push(`${at}: architecture should have at least one input, core and output node`);
    }
  });

  if (problems.length) {
    console.warn(`[products.js] ${problems.length} problem(s):\n• ${problems.join('\n• ')}`);
  }
  const remaining = products.filter((p) => p.placeholder).length;
  if (remaining) console.info(`[products.js] ${remaining} placeholder product(s) still in the catalog.`);
}
